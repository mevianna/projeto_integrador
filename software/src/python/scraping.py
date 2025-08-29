
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  

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

if __name__ == '__main__':
    app.run(debug=True)
