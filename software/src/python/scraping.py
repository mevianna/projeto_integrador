"""
* ***************************************************************************
* File name: scraping.py
* Description: Flask server for extracting images, icons, and credits from web pages.
* Creates endpoints to allow the front-end to obtain information from external pages provided via JSON.
*
* Author: Beatriz Schulter Tartare
* Creation date: 10/29/2025
* Last modification: 11/27/2025
* Contact: beastartareufsc@gmail.com
* ***************************************************************************
* Detailed description:
* This script creates a Flask server with three main endpoints:
* 
* 1. /get_first_image  : Returns the full URL of the first image found on the given page.
* 2. /get_icon         : Returns the 'alt' attribute of the second image on the page.
* 3. /get_credits      : Returns the associated image credit text.
*
* All endpoints expect to receive a JSON containing the key "link" with the site URL.
* They return JSON with the requested data or appropriate error messages (400, 404, or 500).
*
* Flow of each endpoint:
* - Receives JSON from the POST request.
* - Validates the presence of the link.
* - Makes an HTTP GET request to the site.
* - Processes the HTML using BeautifulSoup.
* - Extracts the required information (image, icon, credit).
* - Returns JSON with the result or an error message.
*
* Error handling:
* - Link not provided: returns 400 with {"error": "..."}.
* - Elements not found on the page: returns 404 with {"error": "..."}.
* - HTTP request errors: returns 500 with {"error": "..."}.
*
* Requirements:
* - Python 3.13.1
* - Libraries:
*     - Flask
*     - Flask-CORS
*     - requests
*     - BeautifulSoup (bs4)
*
* Notes:
* - Enables CORS to allow requests from any origin.
* - Run the server in debug mode for development.
* ***************************************************************************
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/get_first_image', methods=['POST'])
def get_first_image():
   
    data = request.get_json()
    link_site = data.get('link')

    if not link_site:
        return jsonify({'error': 'Link do site não fornecido.'}), 400

    try:
        res = requests.get(link_site)
        res.raise_for_status() 
        dados = BeautifulSoup(res.text, "html.parser")
        primeira_imagem = dados.find('img')
      
        if primeira_imagem:
            url_imagem_relativa = primeira_imagem.get('src')
            from urllib.parse import urljoin
            url_completa = urljoin(link_site, url_imagem_relativa)
            return jsonify({'image_url': url_completa})
        else:
            return jsonify({'error': 'Nenhuma imagem encontrada na página.'}), 404

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Erro ao acessar o site: {e}'}), 500
    
@app.route('/get_icon', methods=['POST'])
def get_icon():
    data = request.get_json()
    link_site = data.get('link')

    if not link_site:
        return jsonify({'error': 'Link do site não fornecido.'}), 400

    try:
        res = requests.get(link_site)
        res.raise_for_status() 
        
        dados = BeautifulSoup(res.text, "html.parser")
        imagens = dados.find_all('img') 

        if len(imagens) > 1:
            segundo_icon = imagens[1]  
            alt_text = segundo_icon.get('alt', '')
            return jsonify({'icon_alt': alt_text})
        else:
            return jsonify({'error': 'Menos de duas imagens encontradas.'}), 404

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Erro ao acessar o site: {e}'}), 500

@app.route('/get_credits', methods=['POST'])
def get_credits():
    data = request.get_json()
    link_site = data.get('link')

    if not link_site:
        return jsonify({'error': 'Link do site não fornecido.'}), 400

    try:
        res = requests.get(link_site)
        res.raise_for_status() 
        
        dados = BeautifulSoup(res.text, "html.parser")
        texto = dados.find('h2', string='Image credit')  

        if texto: 
            credit = texto.find_next_sibling('p').text
            return jsonify({'credit_text': credit})
        else:
            return jsonify({'error': 'sem creditos.'}), 404

    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Erro ao acessar o site: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=True)