# Model Benchmarking for Network Intrusion Detection

## Overview
A comprehensive comparative evaluation of four machine learning algorithms for network intrusion detection systems (IDS). The research addresses the critical challenge of class imbalance in cybersecurity datasets, where benign traffic dominates malicious instances by ratios exceeding 100:1. Evaluates Random Forest, XGBoost, SVM, and Multi-Layer Perceptron under identical experimental conditions using the CICIDS2017 dataset.

## Technologies Used
- Python 3.8+
- scikit-learn for ML algorithms (Random Forest, SVM, MLP)
- XGBoost for gradient boosting classification
- imbalanced-learn for SMOTE and resampling strategies
- pandas, numpy for data processing
- matplotlib, seaborn for visualization
- Jupyter Notebook for interactive analysis

## Key Features
1. Systematic comparison of 4 ML algorithms (Random Forest, XGBoost, SVM, MLP) under identical conditions
2. Novel hybrid resampling strategy combining Random Undersampling and SMOTE
3. Detection of 7 categories of network attacks (DDoS, Port Scanning, Botnet, Web Attacks, Infiltration, DoS)
4. Feature importance analysis identifying critical network traffic discriminators
5. Cross-validation stability analysis with detailed per-class metrics
6. Production deployment guidelines with training efficiency and inference latency benchmarks
7. Comprehensive confusion matrices and performance comparison visualizations

## Technical Implementation

### Data Preprocessing Pipeline
- Target separation with 53 network traffic features
- Label encoding for categorical attack types
- Stratified 80/20 train-test split maintaining class proportions
- RobustScaler normalization to minimize outlier effects

### Hybrid Resampling Strategy
Two-stage approach to handle extreme class imbalance:
- Stage 1: Random Undersampling reducing benign traffic to 200,000 samples
- Stage 2: Class-specific SMOTE oversampling (2,000–200,000 synthetic samples based on attack rarity)
- Reduced dataset from 2.8M to ~620K samples while preserving attack diversity

### Machine Learning Models
- Random Forest: 20 decision trees, max_depth=15 (best interpretability)
- XGBoost: 30 sequential trees, learning_rate=0.1 (best balanced performance)
- SVM: Linear kernel, C=1.0 (efficient on high-dimensional data)
- MLP: 53→128→64→7 feedforward network with ReLU activation

## Challenges Solved
- Addressed the "accuracy paradox" in imbalanced learning where standard algorithms develop strong majority-class bias
- Improved minority class recall from baseline 35% to 85-98% through hybrid resampling
- Identified top 5 discriminative features (flow duration, packets/sec, avg packet length, bytes/sec, subflow counts)
- Demonstrated that 15-20 top features can maintain 98%+ accuracy (dimensionality reduction potential)
- Provided quantitative deployment trade-offs for training efficiency, inference latency, and interpretability

## Results
- Random Forest achieved 98.91% test accuracy with excellent cross-validation stability (CV Std: 0.000063)
- XGBoost delivered best balanced performance: 97.67% precision, 97.43% recall, 97.44% F1-score
- Hybrid resampling increased minority class detection from 35% to 85-98%
- Random Forest trained in 45s, XGBoost in 90s, SVM in 120s, MLP in 180s
- Feature importance analysis showed Spearman correlation r ≈ 0.89 between RF and XGBoost rankings

## Links
- GitHub: https://github.com/Shah-Afraz411/Model-Benchmarking-for-Network-Intrusion-Detection

## Year
2025

## Learnings
- Deep understanding of class imbalance handling in machine learning
- Practical experience with ensemble methods (bagging and boosting)
- Network security domain knowledge and intrusion detection systems
- Rigorous experimental methodology with reproducible benchmarks
- Feature importance analysis and dimensionality reduction techniques
