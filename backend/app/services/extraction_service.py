import re
from typing import Dict, Any, List, Optional
from app.models.models import DocumentExtractionResult
from app.services.ocr_service import extract_text_from_file

def extract_order_from_document(file_bytes: bytes, filename: str) -> DocumentExtractionResult:
    """
    Structured AI Document Extraction System.
    Parses document text using natural language heuristics and regex patterns.
    Strictly identifies and reports missing mandatory fields without inventing data.
    """
    raw_text, doc_type = extract_text_from_file(file_bytes, filename)
    
    order_id = None
    product = None
    quantity = None
    due_date = None
    material = None
    
    # Regex Patterns for Order ID
    order_id_match = re.search(r'(?:order\s*id|ord\s*#|order\s*#|po\s*#)\s*[:=]?\s*([A-Z0-9\-_]+)', raw_text, re.IGNORECASE)
    if order_id_match:
        order_id = order_id_match.group(1).strip()
    else:
        # Check general order format like ORD-XXXX or PO-XXXX
        order_id_gen = re.search(r'\b(ORD-[A-Z0-9]+|PO-[A-Z0-9]+)\b', raw_text, re.IGNORECASE)
        if order_id_gen:
            order_id = order_id_gen.group(1).strip()

    # Regex Patterns for Product
    # Match known catalog items or explicit labels
    prod_match = re.search(r'(?:product|item|part|name)\s*[:=]?\s*([A-Za-z0-9\s\-]+)', raw_text, re.IGNORECASE)
    if prod_match:
        cand = prod_match.group(1).strip().split('\n')[0].split(',')[0]
        if len(cand) < 30:
            product = cand
            
    # Fuzzy catalog lookup if not matched via label
    if not product:
        for known_prod in ["Gear", "Valve Body", "Valve", "Shaft", "Bolt"]:
            if re.search(r'\b' + re.escape(known_prod) + r'\b', raw_text, re.IGNORECASE):
                product = known_prod
                break

    # Regex Patterns for Quantity
    qty_match = re.search(r'(?:quantity|qty|amount|units)\s*[:=]?\s*(\d+)', raw_text, re.IGNORECASE)
    if qty_match:
        quantity = int(qty_match.group(1))
    else:
        # Fallback look for standalone numbers near product
        standalone = re.findall(r'\b(\d{2,5})\b', raw_text)
        if standalone:
            # Pick reasonable qty integer
            for num in standalone:
                if 10 <= int(num) <= 10000:
                    quantity = int(num)
                    break

    # Regex Patterns for Due Date
    date_match = re.search(r'(?:due\s*date|delivery|date|required\s*by)\s*[:=]?\s*(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4})', raw_text, re.IGNORECASE)
    if date_match:
        due_date = date_match.group(1).strip()
    else:
        # ISO Date pattern
        iso_match = re.search(r'\b(\d{4}-\d{2}-\d{2})\b', raw_text)
        if iso_match:
            due_date = iso_match.group(1)

    # Regex Patterns for Material
    mat_match = re.search(r'(?:material|mat|specification)\s*[:=]?\s*([A-Za-z0-9\s\-]+)', raw_text, re.IGNORECASE)
    if mat_match:
        cand_mat = mat_match.group(1).strip().split('\n')[0].split(',')[0]
        if len(cand_mat) < 30:
            material = cand_mat
    if not material:
        for known_mat in ["Steel", "Stainless Steel", "Aluminium", "Aluminum", "Carbon Steel", "Brass"]:
            if re.search(r'\b' + re.escape(known_mat) + r'\b', raw_text, re.IGNORECASE):
                material = known_mat
                break

    # Identify missing mandatory fields
    missing_fields = []
    if not order_id:
        missing_fields.append("Order ID")
    if not product:
        missing_fields.append("Product")
    if not quantity:
        missing_fields.append("Quantity")
    if not due_date:
        missing_fields.append("Due Date")

    return DocumentExtractionResult(
        order_id=order_id,
        product=product,
        quantity=quantity,
        due_date=due_date,
        material=material,
        missing_fields=missing_fields,
        raw_text=raw_text[:500],
        confidence=0.95 if not missing_fields else 0.70
    )
