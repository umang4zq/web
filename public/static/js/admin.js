/**
 * THE HOUSE OF WEAR - Admin JavaScript
 * BCA Semester 6 Project - Premium Luxury E-Commerce
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // SIDEBAR TOGGLE
    // ============================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // ============================================
    // FLASH MESSAGES AUTO DISMISS
    // ============================================
    const flashMessages = document.querySelectorAll('.flash-messages .alert');
    
    flashMessages.forEach(function(alert) {
        setTimeout(function() {
            const bsAlert = bootstrap.Alert.getInstance(alert);
            if (bsAlert) {
                bsAlert.close();
            } else {
                alert.remove();
            }
        }, 5000);
    });
    
    // ============================================
    // CONFIRM DELETE
    // ============================================
    const deleteButtons = document.querySelectorAll('a[href*="delete"]');
    
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            const message = this.getAttribute('onclick');
            if (!message || !message.includes('confirm')) {
                const confirmMsg = 'Are you sure you want to delete this item?';
                if (!confirm(confirmMsg)) {
                    e.preventDefault();
                }
            }
        });
    });
    
    // ============================================
    // IMAGE PREVIEW
    // ============================================
    const imageInputs = document.querySelectorAll('input[type="file"]');
    
    imageInputs.forEach(function(input) {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!allowedTypes.includes(file.type)) {
                    alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                    this.value = '';
                    return;
                }
                
                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                    alert('File size should not exceed 5MB');
                    this.value = '';
                    return;
                }
                
                // Preview image if preview element exists
                const previewContainer = this.closest('.modal-body').querySelector('.current-logo, .current-image, .current-image-small');
                if (previewContainer) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        let img = previewContainer.querySelector('img');
                        if (!img) {
                            img = document.createElement('img');
                            previewContainer.innerHTML = '';
                            previewContainer.appendChild(img);
                        }
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    });
    
    // ============================================
    // FORM VALIDATION
    // ============================================
    const forms = document.querySelectorAll('form');
    
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            let firstInvalid = null;
            
            requiredFields.forEach(function(field) {
                // Remove existing error styles
                field.classList.remove('is-invalid');
                
                // Check if field is empty
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    
                    if (!firstInvalid) {
                        firstInvalid = field;
                    }
                }
            });
            
            // Validate price fields
            const priceFields = form.querySelectorAll('input[name="price"], input[name="discount_price"]');
            priceFields.forEach(function(field) {
                const value = parseFloat(field.value);
                if (value < 0) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    alert('Price cannot be negative');
                }
            });
            
            // Validate stock field
            const stockField = form.querySelector('input[name="stock"]');
            if (stockField) {
                const stock = parseInt(stockField.value);
                if (stock < 0) {
                    isValid = false;
                    stockField.classList.add('is-invalid');
                    alert('Stock cannot be negative');
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });
    
    // ============================================
    // DYNAMIC PRICE CALCULATION
    // ============================================
    const priceInput = document.querySelector('input[name="price"]');
    const discountInput = document.querySelector('input[name="discount_price"]');
    
    if (priceInput && discountInput) {
        discountInput.addEventListener('change', function() {
            const price = parseFloat(priceInput.value) || 0;
            const discount = parseFloat(this.value) || 0;
            
            if (discount >= price) {
                alert('Discount price should be less than regular price');
                this.value = '';
            }
        });
    }
    
    // ============================================
    // TABLE SORTING
    // ============================================
    const tables = document.querySelectorAll('.admin-table');
    
    tables.forEach(function(table) {
        const headers = table.querySelectorAll('thead th');
        
        headers.forEach(function(header, index) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                sortTable(table, index);
            });
        });
    });
    
    function sortTable(table, columnIndex) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort(function(a, b) {
            const aValue = a.cells[columnIndex].textContent.trim();
            const bValue = b.cells[columnIndex].textContent.trim();
            
            // Check if values are numbers
            const aNum = parseFloat(aValue.replace(/[^0-9.-]+/g, ''));
            const bNum = parseFloat(bValue.replace(/[^0-9.-]+/g, ''));
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return aNum - bNum;
            }
            
            return aValue.localeCompare(bValue);
        });
        
        rows.forEach(function(row) {
            tbody.appendChild(row);
        });
    }
    
    // ============================================
    // SEARCH IN TABLE
    // ============================================
    const searchInputs = document.querySelectorAll('.table-search');
    
    searchInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = document.querySelector(this.dataset.table);
            
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(function(row) {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });
    
    // ============================================
    // STATUS UPDATE CONFIRMATION
    // ============================================
    const statusForms = document.querySelectorAll('form[action*="update-status"]');
    
    statusForms.forEach(function(form) {
        const select = form.querySelector('select[name="status"]');
        const originalValue = select ? select.value : null;
        
        if (select) {
            select.addEventListener('change', function() {
                const newValue = this.value;
                
                if (newValue === 'cancelled' && originalValue !== 'cancelled') {
                    if (!confirm('Are you sure you want to cancel this order?')) {
                        this.value = originalValue;
                    }
                }
            });
        }
    });
    
    // ============================================
    // PRINT FUNCTIONALITY
    // ============================================
    const printButtons = document.querySelectorAll('.btn-print');
    
    printButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            window.print();
        });
    });
    
    // ============================================
    // EXPORT TO CSV
    // ============================================
    const exportButtons = document.querySelectorAll('.btn-export');
    
    exportButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const tableId = this.dataset.table;
            const table = document.getElementById(tableId);
            
            if (table) {
                exportTableToCSV(table, 'export.csv');
            }
        });
    });
    
    function exportTableToCSV(table, filename) {
        const rows = table.querySelectorAll('tr');
        let csv = [];
        
        rows.forEach(function(row) {
            const cols = row.querySelectorAll('td, th');
            const rowData = [];
            
            cols.forEach(function(col) {
                let data = col.textContent.replace(/"/g, '""').trim();
                rowData.push('"' + data + '"');
            });
            
            csv.push(rowData.join(','));
        });
        
        downloadCSV(csv.join('\n'), filename);
    }
    
    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
    
    // ============================================
    // TOOLTIPS
    // ============================================
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(function(tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // ============================================
    // LOADING STATES
    // ============================================
    const submitButtons = document.querySelectorAll('button[type="submit"]');
    
    submitButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const form = this.closest('form');
            
            if (form && form.checkValidity()) {
                this.disabled = true;
                this.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Loading...';
                form.submit();
            }
        });
    });
    
    // ============================================
    // CHARACTER COUNTERS
    // ============================================
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(function(textarea) {
        const maxLength = textarea.getAttribute('maxlength');
        const counter = document.createElement('small');
        counter.className = 'form-text text-muted char-counter';
        counter.textContent = '0 / ' + maxLength + ' characters';
        textarea.parentNode.appendChild(counter);
        
        textarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            counter.textContent = currentLength + ' / ' + maxLength + ' characters';
            
            if (currentLength >= maxLength) {
                counter.classList.add('text-danger');
            } else {
                counter.classList.remove('text-danger');
            }
        });
    });
    
    console.log('THE HOUSE OF WEAR - Admin JavaScript loaded successfully');
});
