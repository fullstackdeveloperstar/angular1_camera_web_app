export function debounce(func, wait, immediate) {
	var timeout;
	var debounced = function () {
		var context = this, args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
  };
  
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};

export const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
export const ie11 = !!window.MSInputMethodContext && !!document.documentMode;
