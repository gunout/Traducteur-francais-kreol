// js/script.js - Version corrigée
console.log('=== DÉMARRAGE TRADUCTEUR ===');

// Attendre que la page soit complètement chargée
window.addEventListener('load', function() {
    console.log('✅ Page complètement chargée');
    initialiserTraducteur();
});

function initialiserTraducteur() {
    console.log('🔧 Initialisation du traducteur...');
    
    // Vérifier le dictionnaire
    if (typeof dictionnaire === 'undefined') {
        console.error('❌ Dictionnaire non trouvé!');
        document.getElementById('output-1').textContent = 'ERREUR: Dictionnaire non chargé';
        return;
    }
    
    console.log('✅ Dictionnaire chargé:', Object.keys(dictionnaire).length, 'mots');
    
    // Références aux éléments HTML
    const sourceText = document.getElementById('source-text');
    const sourceLang = document.getElementById('source-lang');
    const targetLang = document.getElementById('target-lang-1');
    const translateBtn = document.getElementById('translate-btn');
    const output = document.getElementById('output-1');
    const copyBtn = document.getElementById('copy-btn');
    
    // Vérifier que tous les éléments existent
    if (!sourceText || !sourceLang || !targetLang || !translateBtn || !output || !copyBtn) {
        console.error('❌ Éléments HTML manquants');
        output.textContent = 'ERREUR: Éléments manquants';
        return;
    }
    
    console.log('✅ Tous les éléments HTML trouvés');
    
    // Construire le dictionnaire inverse (Français → Créole)
    console.log('🔄 Construction du dictionnaire inverse...');
    const dictionnaireInverse = {};
    
    for (const [creole, francais] of Object.entries(dictionnaire)) {
        if (francais && typeof francais === 'string') {
            const francaisPropre = francais.toLowerCase().trim();
            if (francaisPropre && !dictionnaireInverse[francaisPropre]) {
                dictionnaireInverse[francaisPropre] = creole;
            }
        }
    }
    
    console.log('✅ Dictionnaire inverse construit');
    
    // Fonction de traduction principale
    function traduire() {
        console.log('🎯 Début de la traduction...');
        
        const texte = sourceText.value.trim();
        const langueSource = sourceLang.value;
        const langueCible = targetLang.value;
        
        console.log('📝 Texte:', texte);
        console.log('🌐 Direction:', langueSource, '→', langueCible);
        
        if (!texte) {
            output.textContent = '';
            console.log('ℹ️ Texte vide');
            return;
        }
        
        let resultat = '';
        
        if (langueSource === 'creole' && langueCible === 'fr') {
            // Créole → Français
            const mots = texte.split(/\s+/);
            resultat = mots.map(mot => {
                const motPropre = mot.toLowerCase().replace(/[.,!?;]/g, '');
                const traduction = dictionnaire[motPropre];
                return traduction || mot;
            }).join(' ');
            
        } else if (langueSource === 'fr' && langueCible === 'creole') {
            // Français → Créole
            const mots = texte.split(/\s+/);
            resultat = mots.map(mot => {
                const motPropre = mot.toLowerCase().replace(/[.,!?;]/g, '');
                const traduction = dictionnaireInverse[motPropre];
                return traduction || mot;
            }).join(' ');
            
        } else {
            resultat = '[Direction de traduction non supportée]';
        }
        
        console.log('✅ Résultat:', resultat);
        output.textContent = resultat;
    }
    
    // Fonction pour inverser les langues automatiquement
    function inverserLangues() {
        if (sourceLang.value === targetLang.value) {
            targetLang.value = sourceLang.value === 'fr' ? 'creole' : 'fr';
        }
    }
    
    // Configuration des événements
    translateBtn.addEventListener('click', traduire);
    sourceText.addEventListener('input', traduire);
    
    sourceLang.addEventListener('change', function() {
        inverserLangues();
        traduire();
    });
    
    targetLang.addEventListener('change', traduire);
    
    copyBtn.addEventListener('click', function() {
        const texteACopier = output.textContent;
        if (texteACopier.trim()) {
            navigator.clipboard.writeText(texteACopier).then(() => {
                const texteOriginal = this.textContent;
                this.textContent = '✅ Copié!';
                this.style.backgroundColor = '#00ff00';
                this.style.color = '#000';
                
                setTimeout(() => {
                    this.textContent = texteOriginal;
                    this.style.backgroundColor = '';
                    this.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie:', err);
                this.textContent = '❌ Erreur';
            });
        }
    });
    
    // Test automatique au chargement
    console.log('🧪 Test automatique...');
    sourceText.value = 'bonzour';
    setTimeout(traduire, 500);
    
    console.log('🎉 Traducteur initialisé avec succès!');
}