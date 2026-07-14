from dataclasses import dataclass
from typing import Any, Dict, List, Tuple

import numpy as np
import pandas as pd

from sklearn.base import clone
from sklearn.decomposition import PCA
from sklearn.ensemble import ExtraTreesClassifier, RandomForestClassifier, VotingClassifier
from sklearn.feature_selection import SelectKBest, f_classif, VarianceThreshold
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import GridSearchCV, StratifiedKFold, cross_val_predict, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import LinearSVC, SVC

RANDOM_STATE = 42
PRIMARY_METRIC = "balanced_accuracy"
SCORING = {
    "balanced_accuracy": "balanced_accuracy",
    "f1_macro": "f1_macro",
    "accuracy": "accuracy",
}
CV = StratifiedKFold(n_splits=5, shuffle=True, random_state=RANDOM_STATE)


@dataclass(frozen=True)
class CandidateSpec:
    name: str
    estimator: Any
    param_grid: Dict[str, List[Any]]
    feature_set: str
    scale: bool = False
    select_k: int | None = None
    pca_components: int | None = None


def make_model_pipeline(estimator, scale=False, select_k=None, pca_components=None):
    steps = [("variance", VarianceThreshold())]
    if scale:
        steps.append(("scale", StandardScaler()))
    if select_k is not None:
        steps.append(("select", SelectKBest(f_classif, k=select_k)))
    if pca_components is not None:
        steps.append(("pca", PCA(n_components=pca_components, random_state=RANDOM_STATE)))
    steps.append(("model", estimator))
    return Pipeline(steps)


def build_candidate_specs():
    return [
        CandidateSpec(
            name="Logistic Regression + selected genes",
            estimator=LogisticRegression(class_weight="balanced", max_iter=5000, solver="liblinear"),
            param_grid={"select__k": [250, 500, 1000], "model__C": [0.1, 1.0, 10.0]},
            feature_set="ANOVA-selected genes",
            scale=True,
            select_k=500,
        ),
        CandidateSpec(
            name="Linear SVM + selected genes",
            estimator=LinearSVC(class_weight="balanced", max_iter=5000, random_state=RANDOM_STATE),
            param_grid={"select__k": [250, 500, 1000], "model__C": [0.1, 1.0, 10.0]},
            feature_set="ANOVA-selected genes",
            scale=True,
            select_k=500,
        ),
        CandidateSpec(
            name="RBF SVM + PCA",
            estimator=SVC(kernel="rbf", class_weight="balanced", probability=True),
            param_grid={"pca__n_components": [30, 50], "model__C": [1.0, 10.0], "model__gamma": ["scale"]},
            feature_set="PCA features",
            scale=True,
            pca_components=50,
        ),
        CandidateSpec(
            name="Extra Trees + selected genes",
            estimator=ExtraTreesClassifier(class_weight="balanced", random_state=RANDOM_STATE, n_jobs=-1),
            param_grid={
                "select__k": [500, 1000],
                "model__n_estimators": [300],
                "model__min_samples_leaf": [1, 5],
                "model__max_features": ["sqrt"],
            },
            feature_set="ANOVA-selected genes",
            select_k=1000,
        ),
        CandidateSpec(
            name="Random Forest + selected genes",
            estimator=RandomForestClassifier(class_weight="balanced", random_state=RANDOM_STATE, n_jobs=-1),
            param_grid={
                "select__k": [500, 1000],
                "model__n_estimators": [300],
                "model__max_depth": [None, 10],
                "model__max_features": ["sqrt"],
            },
            feature_set="ANOVA-selected genes",
            select_k=1000,
        ),
    ]


def run_grid_searches_for_dataset(X_train: pd.DataFrame, y_train: pd.Series) -> Tuple[pd.DataFrame, Dict[str, GridSearchCV]]:
    rows = []
    fitted_searches = {}

    for spec in build_candidate_specs():
        pipe = make_model_pipeline(
            clone(spec.estimator),
            scale=spec.scale,
            select_k=spec.select_k,
            pca_components=spec.pca_components,
        )
        search = GridSearchCV(
            estimator=pipe,
            param_grid=spec.param_grid,
            scoring=SCORING,
            refit=PRIMARY_METRIC,
            cv=CV,
            n_jobs=1,
            return_train_score=True,
            error_score=np.nan,
        )
        search.fit(X_train, y_train)
        fitted_searches[spec.name] = search
        best_idx = search.best_index_
        row = {
            "model": spec.name,
            "feature_set": spec.feature_set,
            "best_params": search.best_params_,
            "fit_time_mean": search.cv_results_["mean_fit_time"][best_idx],
        }
        for metric in SCORING:
            row[f"{metric}_mean"] = search.cv_results_[f"mean_test_{metric}"][best_idx]
            row[f"{metric}_std"] = search.cv_results_[f"std_test_{metric}"][best_idx]
        row["train_test_gap"] = (
            search.cv_results_[f"mean_train_{PRIMARY_METRIC}"][best_idx]
            - search.cv_results_[f"mean_test_{PRIMARY_METRIC}"][best_idx]
        )
        rows.append(row)

    ranking = pd.DataFrame(rows).sort_values(
        [f"{PRIMARY_METRIC}_mean", f"{PRIMARY_METRIC}_std"],
        ascending=[False, True],
    )
    return ranking.reset_index(drop=True), fitted_searches


def build_shortlist(ranking: pd.DataFrame, max_models: int = 3) -> List[str]:
    shortlist = []
    used_families = set()
    for _, row in ranking.iterrows():
        model_name = row["model"]
        family = model_name.split("+")[0].strip()
        if not shortlist or family not in used_families:
            shortlist.append(model_name)
            used_families.add(family)
        if len(shortlist) >= max_models:
            break
    return shortlist


def evaluate_hard_vote_ensemble(X_train, y_train, searches, shortlist):
    estimators = [(name, clone(searches[name].best_estimator_)) for name in shortlist]
    ensemble = VotingClassifier(estimators=estimators, voting="hard")
    scores = cross_validate(
        ensemble,
        X_train,
        y_train,
        cv=CV,
        scoring=SCORING,
        return_train_score=False,
        n_jobs=1,
    )
    row = {
        "model": "Hard Voting Ensemble",
        "feature_set": "shortlisted best pipelines",
        "best_params": {"base_models": shortlist},
        "fit_time_mean": float(np.mean(scores["fit_time"])),
    }
    for metric in SCORING:
        row[f"{metric}_mean"] = scores[f"test_{metric}"].mean()
        row[f"{metric}_std"] = scores[f"test_{metric}"].std()
    row["train_test_gap"] = np.nan
    return row, ensemble


def select_final_model(X_train: pd.DataFrame, y_train: pd.Series):
    ranking, searches = run_grid_searches_for_dataset(X_train, y_train)
    shortlist = build_shortlist(ranking)
    ensemble_row, ensemble = evaluate_hard_vote_ensemble(X_train, y_train, searches, shortlist)
    comparison = pd.concat([ranking, pd.DataFrame([ensemble_row])], ignore_index=True)
    comparison = comparison.sort_values(
        [f"{PRIMARY_METRIC}_mean", f"{PRIMARY_METRIC}_std"],
        ascending=[False, True],
    ).reset_index(drop=True)

    winner = comparison.iloc[0]["model"]
    if winner == "Hard Voting Ensemble":
        final_estimator = clone(ensemble)
    else:
        final_estimator = clone(searches[winner].best_estimator_)

    final_estimator.fit(X_train, y_train)
    return winner, final_estimator, comparison


def evaluate_final_model(final_estimator, X_train, y_train):
    predicted = cross_val_predict(final_estimator, X_train, y_train, cv=CV, n_jobs=1)
    report = classification_report(y_train, predicted, output_dict=True)
    matrix = confusion_matrix(y_train, predicted, labels=np.unique(y_train))
    return pd.DataFrame(report).T, pd.DataFrame(matrix, index=np.unique(y_train), columns=np.unique(y_train))


def run_supervised_hypoxia_evaluation(datasets: Dict[str, Dict[str, Any]]):
    summaries = []
    fitted_models = {}
    diagnostics = {}

    for key, data in datasets.items():
        X_train = data["X_train"]
        y_train = data["y_train"]
        X_test = data.get("X_test")
        name = data.get("name", key)

        winner, final_estimator, comparison = select_final_model(X_train, y_train)
        report, matrix = evaluate_final_model(final_estimator, X_train, y_train)

        fitted_models[key] = final_estimator
        diagnostics[key] = {
            "comparison": comparison,
            "classification_report": report,
            "confusion_matrix": matrix,
        }

        row = comparison.iloc[0].to_dict()
        row.update({
            "dataset_key": key,
            "dataset": name,
            "selected_model": winner,
            "n_train_cells": X_train.shape[0],
            "n_features": X_train.shape[1],
        })
        if X_test is not None:
            row["n_test_cells"] = X_test.shape[0]
        summaries.append(row)

    return pd.DataFrame(summaries), fitted_models, diagnostics
