/**
 * Font size control system for content tables
 * Manages user-controlled font size with localStorage persistence
 */

const MIN_FONT_SIZE = 12; // pt
const DEFAULT_FONT_SIZE = 20; // pt
const MAX_FONT_SIZE = 32; // pt
const STORAGE_KEY = 'content-table-font-size';

/**
 * Initialize font size system
 * Loads saved font size from localStorage or uses default
 */
function initFontSize() {
    const savedSize = localStorage.getItem(STORAGE_KEY);
    const fontSize = savedSize ? parseInt(savedSize, 10) : DEFAULT_FONT_SIZE;
    
    // Ensure the saved value is within bounds
    const clampedSize = Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, fontSize));
    
    // Apply the font size
    applyFontSize(clampedSize);
    
    return clampedSize;
}

/**
 * Apply font size to CSS variable
 */
function applyFontSize(size) {
    document.documentElement.style.setProperty('--content-table-font-size', size + 'pt');
}

/**
 * Increase font size by 1pt
 */
function increaseFontSize() {
    const currentSize = getCurrentFontSize();
    const newSize = Math.min(MAX_FONT_SIZE, currentSize + 1);
    
    if (newSize !== currentSize) {
        applyFontSize(newSize);
        saveFontSize(newSize);
        updateButtonStates(newSize);
    }
}

/**
 * Decrease font size by 1pt
 */
function decreaseFontSize() {
    const currentSize = getCurrentFontSize();
    const newSize = Math.max(MIN_FONT_SIZE, currentSize - 1);
    
    if (newSize !== currentSize) {
        applyFontSize(newSize);
        saveFontSize(newSize);
        updateButtonStates(newSize);
    }
}

/**
 * Get current font size from CSS variable
 */
function getCurrentFontSize() {
    const computedStyle = getComputedStyle(document.documentElement);
    const fontSize = computedStyle.getPropertyValue('--content-table-font-size');
    return parseInt(fontSize, 10) || DEFAULT_FONT_SIZE;
}

/**
 * Save font size to localStorage
 */
function saveFontSize(size) {
    localStorage.setItem(STORAGE_KEY, size.toString());
}

/**
 * Update button disabled states based on current font size
 */
function updateButtonStates(currentSize) {
    const decreaseBtn = document.getElementById('font-size-decrease');
    const increaseBtn = document.getElementById('font-size-increase');
    
    if (decreaseBtn) {
        decreaseBtn.disabled = currentSize <= MIN_FONT_SIZE;
    }
    
    if (increaseBtn) {
        increaseBtn.disabled = currentSize >= MAX_FONT_SIZE;
    }
}

/**
 * Initialize font size system on DOM ready
 */
document.addEventListener('DOMContentLoaded', function() {
    const currentSize = initFontSize();
    updateButtonStates(currentSize);
});
