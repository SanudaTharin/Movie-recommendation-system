import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load preprocessed CSV
data = pd.read_csv("preprocessd.csv")

# TF-IDF Vectorization
tfidf_vectorizer = TfidfVectorizer(max_features=5000)
tfidf_matrix = tfidf_vectorizer.fit_transform(data['cleaned_text'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

# Recommendation function
def recommend_movies(movie_name, cosine_sim=cosine_sim, df=data, top_n=5):
    idx = df[df['Title'].str.lower() == movie_name.lower()].index
    if len(idx) == 0:
        return ["Movie not found in the database"]
    idx = idx[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    movie_indices = [i[0] for i in sim_scores]
    return df['Title'].iloc[movie_indices].tolist()

# Accept movie name as CLI argument
if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps(["No movie name provided"]))
        sys.exit()

    movie_name = sys.argv[1]
    recommendations = recommend_movies(movie_name)
    print(json.dumps(recommendations))  # Output JSON for Node to parse


