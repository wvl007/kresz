/**
 * Élő, valós idejű, ékezet-független kereső a KRESZ kérdésbankhoz
 */
(function() {
    'use strict';

    function initSearch() {
        const groupsContainer = document.getElementById('groups');
        const indexEl = document.getElementById('index');
        const questions = Array.from(document.querySelectorAll('.question'));

        if (!groupsContainer || questions.length === 0) return;

        // Ékezet-semlegesítő segédfüggvény (pl. "holanc" megtalálja a "hólánc"-ot)
        const norm = function(str) {
            return (str || '')
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
        };

        // Kérdések indexelése a memóriában villámgyors szűréshez
        const indexedQuestions = questions.map(function(q) {
            return {
                el: q,
                group: q.closest('.group'),
                text: norm(q.textContent)
            };
        });

        const allGroups = Array.from(document.querySelectorAll('.group'));

        // Kereső komponens létrehozása
        const searchBox = document.createElement('div');
        searchBox.className = 'search-container';
        searchBox.innerHTML = 
            '<div class="search-input-wrapper">' +
                '<span class="search-icon">🔍</span>' +
                '<input type="text" id="live-search-input" placeholder="Élő keresés kérdésre, szóra vagy kódra (pl. villamos, hólánc, 703366)..." autocomplete="off" />' +
                '<button type="button" id="search-clear-btn" title="Keresés törlése" style="display: none;">✕</button>' +
            '</div>' +
            '<div id="search-status" class="search-status" style="display: none;"></div>';

        // Beszúrás a lap tetejére (a Vissza gomb alá)
        const backP = document.querySelector('p a[href*="index.html"]') ? document.querySelector('p a[href*="index.html"]').closest('p') : null;
        if (backP && backP.parentNode) {
            backP.parentNode.insertBefore(searchBox, backP.nextSibling);
        } else if (indexEl && indexEl.parentNode) {
            indexEl.parentNode.insertBefore(searchBox, indexEl);
        } else {
            document.body.insertBefore(searchBox, document.body.firstChild);
        }

        const input = document.getElementById('live-search-input');
        const clearBtn = document.getElementById('search-clear-btn');
        const statusEl = document.getElementById('search-status');

        let debounceTimer = null;

        function performSearch() {
            const rawVal = input.value.trim();
            const query = norm(rawVal);

            if (!query) {
                clearBtn.style.display = 'none';
                statusEl.style.display = 'none';
                if (indexEl) indexEl.style.display = '';

                indexedQuestions.forEach(function(item) {
                    item.el.style.display = '';
                });

                allGroups.forEach(function(g) {
                    g.style.display = '';
                });
                return;
            }

            clearBtn.style.display = 'inline-flex';
            if (indexEl) indexEl.style.display = 'none'; // Keresés közben a tartalomjegyzéket elrejtjük, hogy a találatok rögtön láthatóak legyenek

            // Több szavas keresés kezelése (ÉS kapcsolat)
            const terms = query.split(/\s+/).filter(Boolean);

            let matchCount = 0;
            const groupMatchCount = new Map();

            allGroups.forEach(function(g) {
                groupMatchCount.set(g, 0);
            });

            indexedQuestions.forEach(function(item) {
                const matches = terms.every(function(term) {
                    return item.text.indexOf(term) !== -1;
                });

                if (matches) {
                    item.el.style.display = '';
                    matchCount++;
                    if (item.group) {
                        groupMatchCount.set(item.group, (groupMatchCount.get(item.group) || 0) + 1);
                    }
                } else {
                    item.el.style.display = 'none';
                }
            });

            // Témakörök elrejtése/megjelenítése a találatok alapján
            allGroups.forEach(function(g) {
                const count = groupMatchCount.get(g) || 0;
                g.style.display = count > 0 ? '' : 'none';
            });

            // Visszajelző sáv
            statusEl.style.display = 'block';
            if (matchCount > 0) {
                statusEl.innerHTML = 'Találatok: <strong>' + matchCount + ' db</strong> kérdés a(z) <em>„' + rawVal + '”</em> kifejezésre';
                statusEl.className = 'search-status search-status-found';
            } else {
                statusEl.innerHTML = 'Nincs találat a(z) <em>„' + rawVal + '”</em> kifejezésre';
                statusEl.className = 'search-status search-status-empty';
            }
        }

        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(performSearch, 50);
        });

        clearBtn.addEventListener('click', function() {
            input.value = '';
            performSearch();
            input.focus();
        });

        // "Tetejére" lebegő gomb
        const topBtn = document.createElement('button');
        topBtn.type = 'button';
        topBtn.className = 'scroll-top-btn';
        topBtn.innerHTML = '↑ Tetejére';
        topBtn.title = 'Ugrás az oldal tetejére';
        document.body.appendChild(topBtn);

        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                topBtn.classList.add('visible');
            } else {
                topBtn.classList.remove('visible');
            }
        });

        topBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
