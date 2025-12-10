$(document).ready(function() {

  'use strict';


  // =====================
  // Share Popup Functions
  // =====================
  
  function showSharePopup() {
    document.getElementById('sharePopup').classList.add('is-visible');
    document.getElementById('shareOverlay').classList.add('is-visible');
  }

  function hideSharePopup() {
    document.getElementById('sharePopup').classList.remove('is-visible');
    document.getElementById('shareOverlay').classList.remove('is-visible');
    // Remove hash and clean up URL
    history.replaceState(null, '', window.location.pathname);
  }

  // Close popup when clicking overlay or close button
  document.getElementById('shareOverlay')?.addEventListener('click', hideSharePopup);
  document.querySelector('.c-share-popup__close')?.addEventListener('click', hideSharePopup);

  // =====================
  // WebShare API Utility Function
  // =====================
  function initWebShare(element) {
    // Check if WebShare API is supported
    if (navigator.share) {
      const metaDescription = document.querySelector('meta[name="description"]');
      // Use data attributes or fallback to metadata description or document.title
      const shareData = {
        title: element.getAttribute('data-share-title') || document.title,
        text: element.getAttribute('data-share-text') || (metaDescription ? metaDescription.getAttribute('content') : document.title),
        url: element.getAttribute('data-share-url') || window.location.href
      };
      // Trigger share dialog
      navigator.share(shareData)
        .then(() => {
          console.log('Page shared successfully');
          hideSharePopup();
        })
        .catch((error) => {
          console.error('Error sharing:', error);
        });
    } else {
      console.warn('WebShare API not supported');
      alert('Sharing is not supported on this browser.');
    }
  }

  // =====================
  // Attach WebShare to elements with data-webshare attribute
  // =====================
  document.querySelectorAll('[data-webshare]').forEach(function(element) {
    element.addEventListener('click', function(e) {
      e.preventDefault();
      initWebShare(this);
    });
  });

  // =====================
  // Check for /#share hash on page load
  // =====================
  if (window.location.hash === '#share') {
    showSharePopup();
  }



  // =====================
  // Table of Contents
  // =====================

  if ( $('.c-table-of-contents').length ) {
    tocbot.init({
      tocSelector: '.c-table-of-contents__content',
      contentSelector: '.c-content',
      listClass: 'c-table-of-contents__list',
      listItemClass: 'c-table-of-contents__list-item',
      linkClass: 'c-table-of-contents__list-link',
      headingSelector: 'h2, h3',
      ignoreSelector: '.kg-header-card > *',
      hasInnerContainers: true,
      scrollSmooth: false
    });
  }

  if ( $('.c-table-of-contents__content').children().length > 0 ) {
    $('.c-table-of-contents').show();
  }

  // =====================
  // Comment Counter Visibility
  // =====================
  
  function setupCommentCounters() {
    const commentCounters = document.querySelectorAll('[data-cove-count-comments]');
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const counter = mutation.target;
          const count = parseInt(counter.textContent);
          const commentLink = counter.closest('.c-card__comment-link, .c-topper__comment-link');
          
          if (commentLink) {
            // Show both icon and count when there is at least one comment, hide entire link when zero
            const hasComments = !isNaN(count) && count > 0;
            commentLink.style.display = hasComments ? 'inline-flex' : 'none';
          }
        }
      });
    });

    commentCounters.forEach((counter) => {
      observer.observe(counter, { childList: true, characterData: true, subtree: true });
    });
  }

  // Initialize comment counters
  setupCommentCounters();
});
