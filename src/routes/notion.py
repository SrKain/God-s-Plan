from flask import Blueprint, request, jsonify
import requests
import os

notion_bp = Blueprint('notion', __name__)

# Configurações da API do Notion
NOTION_TOKEN = 'ntn_v799322124936RT7TDOlQWnRmhMKWb2BOdU1AAu5Fbr7BT'
NOTION_DATABASE_ID = '2181dc6ee081807a98fde92411ca08c3'

@notion_bp.route('/api/notion/database', methods=['GET'])
def get_notion_database():
    """Endpoint para buscar dados da base de dados do Notion"""
    try:
        # Headers para a API do Notion
        headers = {
            'Authorization': f'Bearer {NOTION_TOKEN}',
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        }
        
        # Corpo da requisição para ordenar por data
        body = {
            'sorts': [
                {
                    'property': 'date',
                    'direction': 'descending'
                }
            ]
        }
        
        # Fazer a requisição para a API do Notion
        response = requests.post(
            f'https://api.notion.com/v1/databases/{NOTION_DATABASE_ID}/query',
            headers=headers,
            json=body
        )
        
        if response.status_code == 200:
            data = response.json()
            
            # Processar os dados para o formato esperado pelo frontend
            processed_cards = []
            for page in data.get('results', []):
                card = {
                    'id': page.get('id', ''),
                    'creator': get_property_value(page.get('properties', {}).get('creator')),
                    'description': get_property_value(page.get('properties', {}).get('desc')),
                    'date': get_property_value(page.get('properties', {}).get('date')),
                    'value': float(get_property_value(page.get('properties', {}).get('value')) or 0),
                    'notionUrl': page.get('url', '')
                }
                processed_cards.append(card)
            
            return jsonify({
                'success': True,
                'data': processed_cards
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Notion API error: {response.status_code}',
                'message': response.text
            }), response.status_code
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Server error',
            'message': str(e)
        }), 500

def get_property_value(property_data):
    """Função auxiliar para extrair valores das propriedades do Notion"""
    if not property_data:
        return ''
    
    property_type = property_data.get('type', '')
    
    if property_type == 'title':
        return ''.join([t.get('plain_text', '') for t in property_data.get('title', [])])
    elif property_type == 'rich_text':
        return ''.join([t.get('plain_text', '') for t in property_data.get('rich_text', [])])
    elif property_type == 'date':
        date_obj = property_data.get('date')
        return date_obj.get('start', '') if date_obj else ''
    elif property_type == 'number':
        return property_data.get('number', 0)
    elif property_type == 'select':
        select_obj = property_data.get('select')
        return select_obj.get('name', '') if select_obj else ''
    elif property_type == 'multi_select':
        return ', '.join([s.get('name', '') for s in property_data.get('multi_select', [])])
    else:
        return ''

