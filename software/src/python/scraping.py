"""
* ***************************************************************************
* Nome do arquivo: scraping.py
* Descrição: Servidor Flask para extração de imagens, ícones e créditos de páginas web.
* Cria endpoints para permitir que o front-end obtenha informações de páginas externas fornecidas via JSON.
*
* Autora: Beatriz Schulter Tartare
* Data de criação: 29/10/2025
* Última modificação: 27/11/2025
* Contato: beastartare@gmail.com
* ***************************************************************************
* Descrição detalhada:
* Este script cria um servidor Flask com três endpoints principais:
* 
* 1. /get_first_image  : Retorna a URL completa da primeira imagem encontrada na página informada.
* 2. /get_icon         : Retorna o atributo 'alt' da segunda imagem da página.
* 3. /get_credits      : Retorna o texto do crédito de imagem associado.
*
* Todos os endpoints esperam receber um JSON com a chave "link" contendo a URL do site.
* Retornam JSON com os dados solicitados ou mensagens de erro apropriadas (400, 404 ou 500).
*
* Fluxo de cada endpoint:
* - Recebe JSON da requisição POST.
* - Valida a presença do link.
* - Faz requisição HTTP GET para o site.
* - Processa o HTML usando BeautifulSoup.
* - Extrai a informação requerida (imagem, ícone, crédito).
* - Retorna JSON com resultado ou mensagem de erro.
*
* Tratamento de erros:
* - Link não fornecido: retorna 400 com {"error": "..."}.
* - Elementos não encontrados na página: retorna 404 com {"error": "..."}.
* - Erros de requisição HTTP: retorna 500 com {"error": "..."}.
*
* Requisitos:
* - Python 3.13.1
* - Bibliotecas:
*     - Flask
*     - Flask-CORS
*     - requests
*     - BeautifulSoup (bs4)
*
* Observações:
* - Habilita CORS para permitir requisições de qualquer origem.
* - Rodar o servidor em modo debug para desenvolvimento.
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
        imagens = dados.find_all('img')  # pega todas as imagens

        if len(imagens) > 1:
            segundo_icon = imagens[1]   # segunda imagem
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