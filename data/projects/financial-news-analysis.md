# Financial News Analysis and Stock Prediction

## Overview
A data science project that analyzes financial news articles using NLP techniques and machine learning models to forecast stock price movements. The analysis explores the relationship between news sentiment and stock market performance, providing actionable insights for investors and analysts.

## Technologies Used
- Python 3.7+
- pandas, numpy for data manipulation
- matplotlib, seaborn for visualization
- NLTK for natural language processing
- WordCloud for text visualization
- scikit-learn for machine learning
- Keras/TensorFlow with LSTM neural networks
- yfinance for real-time stock data

## Key Features
1. Exploratory Data Analysis (EDA) with data inspection, cleaning, and visualization
2. Stock ticker extraction from financial news using NLP techniques
3. Sentiment analysis of news articles with polarity scoring
4. Time series forecasting using LSTM neural networks
5. Correlation analysis between news sentiment and stock performance
6. Word frequency analysis and WordCloud generation
7. Technical indicator calculations (RSI, MACD, moving averages)

## Technical Implementation

### Data Pipeline
The project uses three distinct datasets: a financial news dataset with headlines, dates, and descriptions; real-time stock data from yfinance; and a Top 50 American Stock Companies dataset for ticker mapping.

### NLP Processing
- Text preprocessing with tokenization, stop word removal, and lemmatization
- TF-IDF and word embeddings for text representation
- Sentiment classification of articles as positive, negative, or neutral

### Machine Learning Models
- Naive Bayes and SVM for sentiment classification
- LSTM neural networks for time series stock price prediction
- Feature engineering combining sentiment scores with technical indicators

### Analysis Pipeline
1. Data loading and inspection
2. Missing value handling and duplicate removal
3. Text preprocessing and feature extraction
4. Sentiment model training and prediction
5. Stock price forecasting with combined features
6. Correlation analysis and visualization

## Challenges Solved
- Handled missing and noisy data in financial news datasets
- Mapped stock tickers from unstructured news text using NLP entity extraction
- Balanced sentiment analysis accuracy with real-time prediction latency
- Combined heterogeneous data sources (text sentiment + numerical stock data) into unified features
- Optimized LSTM architecture for financial time series forecasting

## Results
- Successfully extracted stock tickers from unstructured financial news
- Achieved accurate sentiment classification of financial articles
- Demonstrated correlation between news sentiment and stock price movements
- Generated actionable forecasting insights for investors
- Complete Jupyter notebook analysis with reproducible results

## Links
- GitHub: https://github.com/Shah-Afraz411/Financial-News-Analysis-and-Stock-Prediction

## Year
2024

## Learnings
- Advanced NLP techniques for domain-specific text analysis
- Time series forecasting with LSTM neural networks
- Feature engineering combining text and numerical data
- Financial data analysis and stock market domain knowledge
- End-to-end data science pipeline development
