// js/script.js - Version corrigée et testée
console.log('=== DÉMARRAGE TRADUCTEUR ===');

// Attendre que la page soit complètement chargée
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM complètement chargé');
    // Petit délai pour s'assurer que le dictionnaire est chargé
    setTimeout(initialiserTraducteur, 100);
});

function initialiserTraducteur() {
    console.log('🔧 Initialisation du traducteur...');
    
    // Vérifier le dictionnaire de manière plus robuste
    if (typeof dictionnaire === 'undefined' || !dictionnaire) {
        console.error('❌ Dictionnaire non trouvé!');
        const output = document.getElementById('output-1');
        if (output) output.textContent = 'ERREUR: Dictionnaire non chargé';
        return;
    }
    
    const nombreMots = Object.keys(dictionnaire).length;
    console.log('✅ Dictionnaire chargé:', nombreMots, 'mots');
    
    // Test immédiat du dictionnaire
    console.log('🧪 Test dictionnaire - "bonzour":', dictionnaire["bonzour"]);
    console.log('🧪 Test dictionnaire - "koman":', dictionnaire["koman"]);
    
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
        const elementsManquants = [];
        if (!sourceText) elementsManquants.push('source-text');
        if (!sourceLang) elementsManquants.push('source-lang');
        if (!targetLang) elementsManquants.push('target-lang-1');
        if (!translateBtn) elementsManquants.push('translate-btn');
        if (!output) elementsManquants.push('output-1');
        if (!copyBtn) elementsManquants.push('copy-btn');
        console.error('Éléments manquants:', elementsManquants);
        return;
    }
    
    console.log('✅ Tous les éléments HTML trouvés');
    
    // Construire le dictionnaire inverse (Français → Créole)
    console.log('🔄 Construction du dictionnaire inverse...');
    const dictionnaireInverse = {};
    let compteurInverse = 0;
    
    for (const [creole, francais] of Object.entries(dictionnaire)) {
        if (francais && typeof francais === 'string') {
            // Nettoyer la traduction française
            const francaisPropre = francais.toLowerCase().trim();
            
            // Séparer les variantes (séparées par "ou")
            const variantes = francaisPropre.split(' ou ');
            
            variantes.forEach(variante => {
                const varianteNettoyee = variante
                    .replace(/[.,!?;]/g, '')
                    .replace(/\([^)]*\)/g, '') // Enlever les parenthèses et leur contenu
                    .trim();
                
                if (varianteNettoyee && varianteNettoyee.length > 1) {
                    if (!dictionnaireInverse[varianteNettoyee]) {
                        dictionnaireInverse[varianteNettoyee] = creole;
                        compteurInverse++;
                    }
                }
            });
            
            // Ajouter aussi la version complète nettoyée
            const francaisNettoye = francaisPropre
                .replace(/[.,!?;]/g, '')
                .replace(/\([^)]*\)/g, '')
                .trim();
                
            if (francaisNettoye && francaisNettoye.length > 1 && !dictionnaireInverse[francaisNettoye]) {
                dictionnaireInverse[francaisNettoye] = creole;
                compteurInverse++;
            }
        }
    }
    
    console.log('✅ Dictionnaire inverse construit:', compteurInverse, 'entrées françaises');
    console.log('🧪 Test inverse - "bonjour":', dictionnaireInverse["bonjour"]);
    console.log('🧪 Test inverse - "comment":', dictionnaireInverse["comment"]);

    // Fonction pour nettoyer un mot
    function nettoyerMot(mot) {
        return mot.toLowerCase().replace(/[.,!?;]/g, '').trim();
    }

    // Fonction pour trouver la traduction
    function trouverTraduction(mot, dictionnaireRecherche) {
        const motPropre = nettoyerMot(mot);
        
        // 1. Chercher une correspondance exacte
        if (dictionnaireRecherche[motPropre]) {
            return dictionnaireRecherche[motPropre];
        }
        
        // 2. Chercher parmi les mots composés (pour les expressions)
        for (const [cle, traduction] of Object.entries(dictionnaireRecherche)) {
            if (cle.includes(' ') && motPropre.includes(cle)) {
                return traduction;
            }
        }
        
        // 3. Si pas trouvé, retourner le mot original
        return mot;
    }

    // Fonction de traduction principale
    function traduire() {
        console.log('🎯 Début de la traduction...');
        
        const texte = sourceText.value.trim();
        const langueSource = sourceLang.value;
        const langueCible = targetLang.value;
        
        console.log('📝 Texte source:', texte);
        console.log('🌐 Direction:', langueSource, '→', langueCible);
        
        if (!texte) {
            output.textContent = '';
            console.log('ℹ️ Texte vide');
            return;
        }
        
        let resultat = '';
        
        try {
            if (langueSource === 'creole' && langueCible === 'fr') {
                // Créole → Français
                const mots = texte.split(/\s+/);
                console.log('Mots à traduire (créole→fr):', mots);
                
                resultat = mots.map(mot => {
                    const traduction = trouverTraduction(mot, dictionnaire);
                    console.log(`"${mot}" → "${traduction}"`);
                    return traduction;
                }).join(' ');
                
            } else if (langueSource === 'fr' && langueCible === 'creole') {
                // Français → Créole
                const mots = texte.split(/\s+/);
                console.log('Mots à traduire (fr→créole):', mots);
                
                resultat = mots.map(mot => {
                    const traduction = trouverTraduction(mot, dictionnaireInverse);
                    console.log(`"${mot}" → "${traduction}"`);
                    return traduction;
                }).join(' ');
                
            } else {
                resultat = '[Direction de traduction non supportée]';
            }
        } catch (erreur) {
            console.error('❌ Erreur lors de la traduction:', erreur);
            resultat = 'Erreur de traduction';
        }
        
        console.log('✅ Résultat final:', resultat);
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
    
    // Fonction de copie
    copyBtn.addEventListener('click', function() {
        const texteACopier = output.textContent;
        if (texteACopier && texteACopier.trim() && texteACopier !== '[Direction de traduction non supportée]') {
            navigator.clipboard.writeText(texteACopier).then(() => {
                const bouton = this;
                const texteOriginal = bouton.textContent;
                bouton.textContent = '✅ Copié!';
                bouton.style.backgroundColor = '#4CAF50';
                bouton.style.color = '#fff';
                
                setTimeout(() => {
                    bouton.textContent = texteOriginal;
                    bouton.style.backgroundColor = '';
                    bouton.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie:', err);
                this.textContent = '❌ Erreur';
                setTimeout(() => {
                    this.textContent = 'Copier';
                }, 2000);
            });
        }
    });
    
    // Test automatique
    console.log('🧪 Test automatique dans 1 seconde...');
    setTimeout(() => {
        if (!sourceText.value.trim()) {
            sourceText.value = 'bonzour koman i lé';
            console.log('📝 Texte de test inséré:', sourceText.value);
            traduire();
        }
    }, 1000);
    
    console.log('🎉 Traducteur initialisé avec succès!');
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('❌ Erreur globale:', e.error);
    console.error('Fichier:', e.filename);
    console.error('Ligne:', e.lineno);
});
