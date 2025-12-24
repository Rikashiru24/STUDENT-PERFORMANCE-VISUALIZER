/**
 * Sidebar Toggle Functionality with Tooltip
 * Handles sidebar expansion/collapse with localStorage persistence
 * Shows tooltip on hover in collapsed mode
 */

const SIDEBAR_STORAGE_KEY = 'sidebarCollapsed';
const persistedCollapsedState = localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';

// Apply persisted state immediately to prevent a flash of the expanded sidebar on reload
if (persistedCollapsedState) {
    document.body.classList.add('sidebar-collapsed');
}

class SidebarManager {
    constructor(initialCollapsed = false) {
        this.sidebar = document.querySelector('.sidebar');
        this.sidebarHeader = document.querySelector('.p-sidebar-header');
        this.toggleBtn = document.getElementById('sidebarToggle');
        this.collapseBtn = document.getElementById('collapseBtn');
        this.tooltip = document.getElementById('tooltip');
        this.profileBtn = document.getElementById('profileBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.storageKey = SIDEBAR_STORAGE_KEY;
        
        this.isCollapsed = initialCollapsed;
        this.init();
    }

    init() {
        // Load sidebar state from localStorage
        this.isCollapsed = localStorage.getItem(this.storageKey) === 'true' || this.isCollapsed;
        if (this.isCollapsed) {
            this.collapse();
        } else {
            this.expand();
        }

        // Attach event listeners
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.expand());
            this.toggleBtn.setAttribute('aria-expanded', !this.isCollapsed);
            
            // Add hover listeners for logo change on collapsed mode
            this.toggleBtn.addEventListener('mouseenter', () => this.handleLogoHover());
            this.toggleBtn.addEventListener('mouseleave', () => this.handleLogoLeave());
        }

        if (this.collapseBtn) {
            this.collapseBtn.addEventListener('click', () => this.collapse());
        }

        if (this.profileBtn) {
            this.profileBtn.addEventListener('click', () => this.toggleLogout());
        }

        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.logout());
        }

        // Close logout button when clicking elsewhere
        document.addEventListener('click', (e) => this.handleClickOutside(e));

        // Add active menu item indicator
        this.setActiveMenuItem();
    }

    /**
     * Toggle sidebar between expanded and collapsed states
     */
    toggleSidebar() {
        this.isCollapsed ? this.expand() : this.collapse();
    }

    /**
     * Collapse sidebar to icon-only view (70px)
     */
    collapse() {
        this.isCollapsed = true;
        document.body.classList.add('sidebar-collapsed');
        
        if (this.sidebar) {
            this.sidebar.style.width = '70px';
        }
        
        if (this.sidebarHeader) {
            this.sidebarHeader.style.width = '70px';
            this.sidebarHeader.style.justifyContent = 'center';
        }
        
        if (this.toggleBtn) {
            this.toggleBtn.style.flex = 'none';
            this.toggleBtn.style.width = '70px';
            this.toggleBtn.setAttribute('aria-expanded', 'false');
        }
        
        if (this.collapseBtn) {
            this.collapseBtn.style.display = 'none';
        }
        
        localStorage.setItem(this.storageKey, 'true');
        this.hideLogout();
    }

    /**
     * Expand sidebar to full width (250px)
     */
    expand() {
        this.isCollapsed = false;
        document.body.classList.remove('sidebar-collapsed');
        
        if (this.sidebar) {
            this.sidebar.style.width = '250px';
        }
        
        if (this.sidebarHeader) {
            this.sidebarHeader.style.width = '250px';
            this.sidebarHeader.style.justifyContent = 'space-between';
        }
        
        if (this.toggleBtn) {
            this.toggleBtn.setAttribute('aria-expanded', 'true');
            // Restore original logo when expanding
            const logoImg = this.toggleBtn.querySelector('.sidebar-icon');
            if (logoImg) {
                logoImg.src = 'public/images/gwc-logo.png';
            }
        }
        
        if (this.collapseBtn) {
            this.collapseBtn.style.display = 'flex';
        }
        
        localStorage.setItem(this.storageKey, 'false');
    }

    /**
     * Toggle logout button visibility
     */
    toggleLogout() {
        if (this.logoutBtn) {
            const isVisible = this.logoutBtn.style.display !== 'none';
            this.logoutBtn.style.display = isVisible ? 'none' : 'flex';
            if (!isVisible) {
                this.logoutBtn.focus();
            }
        }
    }

    /**
     * Hide logout button
     */
    hideLogout() {
        if (this.logoutBtn) {
            this.logoutBtn.style.display = 'none';
        }
    }

    /**
     * Handle click outside of sidebar footer to close logout menu
     */
    handleClickOutside(e) {
        const sidebarFooter = document.querySelector('.sidebar-footer');
        if (sidebarFooter && !sidebarFooter.contains(e.target)) {
            this.hideLogout();
        }
    }

    /**
     * Logout function
     */
    logout() {
        if (confirm('Are you sure you want to logout?')) {
            console.log('User logged out');
            // Redirect to login page
            // window.location.href = '/login.html';
        }
    }

    /**
     * Set active menu item based on current page
     */
    setActiveMenuItem() {
        const currentPath = window.location.pathname;
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            // Check if current page matches the menu item
            if (currentPath.includes(href) && href !== '#') {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            } else {
                item.classList.remove('active');
                item.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Handle logo hover - change to sidebar icon in collapsed mode only
     */
    handleLogoHover() {
        if (this.isCollapsed) {
            const logoImg = this.toggleBtn.querySelector('.sidebar-icon');
            if (logoImg) {
                logoImg.src = 'public/images/sidebar.png';
            }
        }
    }

    /**
     * Handle logo leave - restore original logo in collapsed mode
     */
    handleLogoLeave() {
        if (this.isCollapsed) {
            const logoImg = this.toggleBtn.querySelector('.sidebar-icon');
            if (logoImg) {
                logoImg.src = 'public/images/gwc-logo.png';
            }
        }
    }
}

// Initialize sidebar manager as soon as the DOM is ready
const initSidebar = () => new SidebarManager(persistedCollapsedState);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
} else {
    initSidebar();
}

// Handle responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        document.body.classList.add('sidebar-collapsed');
    } else {
        const isCollapsed = localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
        if (!isCollapsed) {
            document.body.classList.remove('sidebar-collapsed');
        }
    }
});
