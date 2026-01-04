/**
 * Utility functions untuk kalkulasi invoice
 */

export const calculateSubtotal = (products) => {
  return products.reduce((total, product) => {
    const harga = parseFloat(product.harga) || 0;
    const qty = parseInt(product.qty) || 0;
    const disc = parseFloat(product.disc) || 0;
    
    const subtotalItem = harga * qty;
    const afterDisc = subtotalItem - (subtotalItem * disc / 100);
    
    return total + afterDisc;
  }, 0);
};

export const calculateTotalDiskon = (products) => {
  return products.reduce((total, product) => {
    const harga = parseFloat(product.harga) || 0;
    const qty = parseInt(product.qty) || 0;
    const disc = parseFloat(product.disc) || 0;
    
    const subtotalItem = harga * qty;
    const diskonItem = subtotalItem * disc / 100;
    
    return total + diskonItem;
  }, 0);
};

export const calculatePajak = (products) => {
  return products.reduce((total, product) => {
    const pajak = parseFloat(product.pajak) || 0;
    const harga = parseFloat(product.harga) || 0;
    const qty = parseInt(product.qty) || 0;
    const disc = parseFloat(product.disc) || 0;
    
    const subtotalItem = harga * qty;
    const afterDisc = subtotalItem - (subtotalItem * disc / 100);
    const pajakItem = afterDisc * pajak / 100;
    
    return total + pajakItem;
  }, 0);
};

export const calculateTotal = (products, diskonTambahan = 0) => {
  const subtotal = calculateSubtotal(products);
  const pajak = calculatePajak(products);
  const diskon = parseFloat(diskonTambahan) || 0;
  
  return subtotal - diskon + pajak;
};

export const calculateJumlahBaris = (product) => {
  const harga = parseFloat(product.harga) || 0;
  const qty = parseInt(product.qty) || 0;
  const disc = parseFloat(product.disc) || 0;
  const pajak = parseFloat(product.pajak) || 0;
  
  const subtotal = harga * qty;
  const afterDisc = subtotal - (subtotal * disc / 100);
  const pajakAmount = afterDisc * pajak / 100;
  
  return afterDisc + pajakAmount;
};
