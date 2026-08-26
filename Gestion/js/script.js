// ============================
// SCRIPT.JS - Bidè Gestion Lavage
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------
  // FORMULAIRE VÉHICULE
  // ----------------------------
  const formVehicule = document.getElementById('formVehicule');

  if (formVehicule) {

    // --- Color picker ---
    const colorSwatches = document.querySelectorAll('.color-swatch');
    let selectedColor = null;

    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        // Retire la sélection précédente
        colorSwatches.forEach(s => s.classList.remove('selected'));
        // Applique la sélection sur la pastille cliquée
        swatch.classList.add('selected');
        selectedColor = swatch.dataset.color;
      });
    });

    // --- Bouton "Effacer" propriétaire ---
    const btnClearProprietaire = document.getElementById('btnClearProprietaire');
    const proprietaireInput = document.getElementById('proprietaire');

    if (btnClearProprietaire && proprietaireInput) {
      btnClearProprietaire.addEventListener('click', () => {
        proprietaireInput.value = '';
        proprietaireInput.focus();
      });
    }

    // --- Bouton Annuler ---
    const btnAnnuler = document.getElementById('btnAnnuler');
    if (btnAnnuler) {
      btnAnnuler.addEventListener('click', () => {
        if (confirm('Voulez-vous vraiment annuler ? Les modifications non enregistrées seront perdues.')) {
          formVehicule.reset();
          colorSwatches.forEach(s => s.classList.remove('selected'));
          selectedColor = null;
          window.location.href = 'listedesvéhicules.html';
        }
      });
    }

    // --- Validation et soumission du formulaire ---
    formVehicule.addEventListener('submit', (e) => {
      e.preventDefault();

      const proprietaire = document.getElementById('proprietaire').value.trim();
      const immatriculation = document.getElementById('immatriculation').value.trim();
      const categorie = document.getElementById('categorie').value;
      const marque = document.getElementById('marque').value.trim();
      const modele = document.getElementById('modele').value.trim();
      const notes = document.getElementById('notes').value.trim();

      // Validation simple des champs obligatoires
      if (!proprietaire) {
        alert('Veuillez sélectionner un propriétaire.');
        document.getElementById('proprietaire').focus();
        return;
      }

      if (!immatriculation) {
        alert('Veuillez saisir l\'immatriculation du véhicule.');
        document.getElementById('immatriculation').focus();
        return;
      }

      // Vérifie le format TG-XXXX-XX (ex: TG-1234-AB)
      const formatImmat = /^TG-\d{4}-[A-Z]{2}$/i;
      if (!formatImmat.test(immatriculation)) {
        alert('Le format de l\'immatriculation doit être TG-XXXX-XX (ex: TG-1234-AB).');
        document.getElementById('immatriculation').focus();
        return;
      }

      if (!categorie) {
        alert('Veuillez sélectionner une catégorie de véhicule.');
        document.getElementById('categorie').focus();
        return;
      }

      // Objet véhicule prêt à être envoyé / stocké
      const vehicule = {
        proprietaire,
        immatriculation: immatriculation.toUpperCase(),
        categorie,
        marque,
        modele,
        couleur: selectedColor || 'non précisée',
        notes
      };

      console.log('Véhicule enregistré :', vehicule);

      // Ici : appel API / sauvegarde (à brancher plus tard côté backend)
      alert('Véhicule enregistré avec succès !');
      formVehicule.reset();
      colorSwatches.forEach(s => s.classList.remove('selected'));
      selectedColor = null;
    });
  }

});

// ----------------------------
// CATALOGUE DES PRESTATIONS
// ----------------------------
const listePrestations = document.getElementById('listePrestations');

if (listePrestations) {

  // Effet visuel léger au clic sur une carte (aperçu / futur détail)
  const cartes = listePrestations.querySelectorAll('.prestation-card');

  cartes.forEach(carte => {
    carte.style.cursor = 'pointer';

    carte.addEventListener('click', () => {
      const nomService = carte.querySelector('h5').textContent.trim();
      const prix = carte.querySelector('.prestation-prix').textContent.trim();
      console.log(`Prestation sélectionnée : ${nomService} - ${prix}`);

      // Ici on pourra plus tard rediriger vers un détail
      // ou pré-remplir une nouvelle commande avec ce service
      // window.location.href = `nouvellecommande.html?service=${encodeURIComponent(nomService)}`;
    });
  });

}

// ----------------------------
// NOUVELLE COMMANDE (Stepper)
// ----------------------------
const stepperNav = document.getElementById('stepperNav');

if (stepperNav) {

  let currentStep = 1;
  const totalSteps = 4;

  // Données de la commande en cours de création
  const commande = {
    client: null,
    vehicule: null,
    services: [],
    date: null,
    heure: null,
    laveur: null
  };

  // --- Prestations disponibles (pourrait venir du catalogue plus tard) ---
  const prestationsDisponibles = [
    { nom: 'Lavage Express', duree: '15 min', prix: 2000 },
    { nom: 'Lavage Complet', duree: '45 min', prix: 5000 },
    { nom: 'Premium', duree: '1h 30', prix: 12000 },
    { nom: 'Lavage Moteur', duree: '30 min', prix: 8000 },
    { nom: 'Lustrage Express', duree: '40 min', prix: 15000 }
  ];

  // --- Navigation entre étapes ---
  function afficherEtape(step) {
    document.querySelectorAll('.step-content').forEach(el => el.classList.add('d-none'));
    document.getElementById(`step${step}`).classList.remove('d-none');

    document.querySelectorAll('.step').forEach(el => {
      const num = parseInt(el.dataset.step);
      el.classList.remove('active', 'completed');
      if (num === step) {
        el.classList.add('active');
      } else if (num < step) {
        el.classList.add('completed');
      }
    });

    currentStep = step;

    if (step === 2) genererServices();
    if (step === 4) genererResume();
  }

  // --- Étape 1 : sélection véhicule/client ---
  const btnSelectionner = document.getElementById('btnSelectionner');
  const btnContinuer1 = document.getElementById('btnContinuer1');

  if (btnSelectionner) {
    btnSelectionner.addEventListener('click', () => {
      commande.vehicule = document.getElementById('resultVehicule').textContent.trim();
      commande.client = document.getElementById('resultClient').textContent.trim();
      btnSelectionner.textContent = 'Sélectionné ✓';
      btnSelectionner.classList.remove('btn-primary');
      btnSelectionner.classList.add('btn-success');
      btnContinuer1.disabled = false;
    });
  }

  const btnNouveauClient = document.getElementById('btnNouveauClient');
  if (btnNouveauClient) {
    btnNouveauClient.addEventListener('click', () => {
      window.location.href = 'formulaireclient.html';
    });
  }

  if (btnContinuer1) {
    btnContinuer1.addEventListener('click', () => afficherEtape(2));
  }

  // --- Étape 2 : sélection des prestations ---
  function genererServices() {
    const container = document.getElementById('servicesSelection');
    container.innerHTML = '';

    prestationsDisponibles.forEach((service, index) => {
      const col = document.createElement('div');
      col.className = 'col-md-6';
      col.innerHTML = `
        <div class="service-option d-flex justify-content-between align-items-center" data-index="${index}">
          <div>
            <strong>${service.nom}</strong>
            <div class="text-muted small"><i class="bi bi-clock me-1"></i>${service.duree}</div>
          </div>
          <span class="fw-bold text-primary">${service.prix.toLocaleString('fr-FR')} FCFA</span>
        </div>
      `;
      container.appendChild(col);
    });

    // Réattacher les événements de clic
    container.querySelectorAll('.service-option').forEach(option => {
      option.addEventListener('click', () => {
        const index = parseInt(option.dataset.index);
        const service = prestationsDisponibles[index];
        const dejaSelectionne = commande.services.find(s => s.nom === service.nom);

        if (dejaSelectionne) {
          commande.services = commande.services.filter(s => s.nom !== service.nom);
          option.classList.remove('selected');
        } else {
          commande.services.push(service);
          option.classList.add('selected');
        }

        const btnSuivantStep2 = document.querySelector('#step2 .btn-suivant');
        btnSuivantStep2.disabled = commande.services.length === 0;
      });
    });
  }

  // --- Étape 3 : planning ---
  const dateCommande = document.getElementById('dateCommande');
  const heureCommande = document.getElementById('heureCommande');
  const laveurAssigne = document.getElementById('laveurAssigne');

  // --- Boutons "Retour" et "Continuer" génériques ---
  document.querySelectorAll('.btn-retour').forEach(btn => {
    btn.addEventListener('click', () => afficherEtape(currentStep - 1));
  });

  document.querySelectorAll('.btn-suivant').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep === 3) {
        commande.date = dateCommande.value;
        commande.heure = heureCommande.value;
        commande.laveur = laveurAssigne.value;

        if (!commande.date || !commande.heure) {
          alert('Veuillez renseigner la date et l\'heure.');
          return;
        }
      }
      afficherEtape(currentStep + 1);
    });
  });

  // --- Étape 4 : résumé ---
  function genererResume() {
    const container = document.getElementById('resumeCommande');
    let total = commande.services.reduce((sum, s) => sum + s.prix, 0);

    let html = `
      <div class="resume-ligne"><span>Véhicule</span><strong>${commande.vehicule || '-'}</strong></div>
      <div class="resume-ligne"><span>Client</span><strong>${commande.client || '-'}</strong></div>
      <div class="resume-ligne"><span>Date</span><strong>${commande.date || '-'} à ${commande.heure || '-'}</strong></div>
      <div class="resume-ligne"><span>Laveur</span><strong>${commande.laveur || 'Non assigné'}</strong></div>
    `;

    commande.services.forEach(service => {
      html += `<div class="resume-ligne"><span>${service.nom}</span><span>${service.prix.toLocaleString('fr-FR')} FCFA</span></div>`;
    });

    html += `<div class="resume-ligne resume-total mt-2"><span>Total</span><span>${total.toLocaleString('fr-FR')} FCFA</span></div>`;

    container.innerHTML = html;
  }

  // --- Validation finale ---
  const btnValiderCommande = document.getElementById('btnValiderCommande');
  if (btnValiderCommande) {
    btnValiderCommande.addEventListener('click', () => {
      console.log('Commande validée :', commande);
      alert('Commande créée avec succès !');
      window.location.href = 'listedescommandes.html';
    });
  }

  // --- Bouton Annuler (étape 1) ---
  const btnAnnulerCommande = document.getElementById('btnAnnulerCommande');
  if (btnAnnulerCommande) {
    btnAnnulerCommande.addEventListener('click', () => {
      if (confirm('Voulez-vous vraiment annuler cette commande ?')) {
        window.location.href = 'listedescommandes.html';
      }
    });
  }

}

// ----------------------------
// LISTE DES COMMANDES (Filtres)
// ----------------------------
const tableCommandes = document.getElementById('tableCommandes');

if (tableCommandes) {

  const filtreDateDebut = document.getElementById('filtreDateDebut');
  const filtreDateFin = document.getElementById('filtreDateFin');
  const filtreStatutLavage = document.getElementById('filtreStatutLavage');
  const filtreStatutPaiement = document.getElementById('filtreStatutPaiement');
  const filtreService = document.getElementById('filtreService');

  const lignes = tableCommandes.querySelectorAll('tbody tr');

  function appliquerFiltres() {
    const statutLavage = filtreStatutLavage.value.toLowerCase();
    const statutPaiement = filtreStatutPaiement.value.toLowerCase();

    lignes.forEach(ligne => {
      let visible = true;

      // Filtre statut lavage
      if (statutLavage) {
        const badgeLavage = ligne.querySelector('td:nth-child(8) .badge');
        const texteLavage = badgeLavage ? badgeLavage.textContent.trim().toLowerCase() : '';
        const correspondance = {
          'en_attente': 'en attente',
          'en_cours': 'en cours',
          'termine': 'terminé'
        };
        if (!texteLavage.includes(correspondance[statutLavage])) {
          visible = false;
        }
      }

      // Filtre statut paiement
      if (statutPaiement) {
        const badgePaiement = ligne.querySelector('td:nth-child(7) .badge');
        const textePaiement = badgePaiement ? badgePaiement.textContent.trim().toLowerCase() : '';
        const correspondance = {
          'paye': 'payé',
          'en_attente': 'en attente'
        };
        if (!textePaiement.includes(correspondance[statutPaiement])) {
          visible = false;
        }
      }

      ligne.style.display = visible ? '' : 'none';
    });
  }

  [filtreStatutLavage, filtreStatutPaiement, filtreService, filtreDateDebut, filtreDateFin]
    .forEach(filtre => filtre && filtre.addEventListener('change', appliquerFiltres));

  // --- Recherche dans la topbar ---
  const inputRecherche = document.querySelector('.topbar-search input');
  if (inputRecherche) {
    inputRecherche.addEventListener('input', () => {
      const terme = inputRecherche.value.trim().toLowerCase();

      lignes.forEach(ligne => {
        const texteComplet = ligne.textContent.toLowerCase();
        ligne.style.display = texteComplet.includes(terme) ? '' : 'none';
      });
    });
  }

  // --- Boutons "Voir" (icône œil) ---
  tableCommandes.querySelectorAll('.btn-outline-secondary[title="Voir"]').forEach(btn => {
    btn.addEventListener('click', () => {
      window.location.href = 'detailcommandefacture.html';
    });
  });

}// ----------------------------
// DÉTAIL COMMANDE + FACTURE
// ----------------------------
const factureCard = document.getElementById('factureCard');

if (factureCard) {

  // --- Bouton Imprimer ---
  const btnImprimer = document.getElementById('btnImprimer');
  if (btnImprimer) {
    btnImprimer.addEventListener('click', () => {
      window.print();
    });
  }

  // --- Bouton Export PDF ---
  const btnExportPDF = document.getElementById('btnExportPDF');
  if (btnExportPDF) {
    btnExportPDF.addEventListener('click', () => {
      // Export réel à brancher plus tard (ex: librairie jsPDF ou impression navigateur en PDF)
      alert('Génération du PDF en cours... (fonctionnalité à connecter à une librairie d\'export)');
    });
  }

  // --- Bouton Envoyer SMS ---
  const btnEnvoyerSMS = document.getElementById('btnEnvoyerSMS');
  if (btnEnvoyerSMS) {
    btnEnvoyerSMS.addEventListener('click', () => {
      const totalNet = document.getElementById('totalNet').textContent;
      const confirmation = confirm(
        `Envoyer un SMS de confirmation au client avec le montant ${totalNet} ?`
      );
      if (confirmation) {
        alert('SMS envoyé avec succès !');
      }
    });
  }

  // --- Recalcul automatique des totaux (si les lignes changent dynamiquement) ---
  function recalculerFacture() {
    const lignes = document.querySelectorAll('#corpsFacture tr');
    let sousTotal = 0;

    lignes.forEach(ligne => {
      const totalLigne = ligne.querySelector('td:last-child').textContent
        .replace(/[^0-9]/g, '');
      sousTotal += parseInt(totalLigne, 10) || 0;
    });

    const tauxTVA = 0.18;
    const tva = Math.round(sousTotal * tauxTVA);
    const totalNet = sousTotal + tva;

    document.getElementById('sousTotal').textContent = `${sousTotal.toLocaleString('fr-FR')} FCFA`;
    document.getElementById('tva').textContent = `${tva.toLocaleString('fr-FR')} FCFA`;
    document.getElementById('totalNet').textContent = `${totalNet.toLocaleString('fr-FR')} FCFA`;
  }

  // Appel initial (utile si le contenu du tableau est généré dynamiquement plus tard)
  recalculerFacture();

}

// ----------------------------
// PAGE CONNEXION
// ----------------------------
const formConnexion = document.getElementById('formConnexion');

if (formConnexion) {

  // --- Afficher/masquer le mot de passe ---
  const togglePassword = document.getElementById('togglePassword');
  const motDePasseInput = document.getElementById('motDePasse');

  if (togglePassword && motDePasseInput) {
    togglePassword.addEventListener('click', () => {
      const type = motDePasseInput.getAttribute('type') === 'password' ? 'text' : 'password';
      motDePasseInput.setAttribute('type', type);

      const icone = togglePassword.querySelector('i');
      icone.classList.toggle('bi-eye');
      icone.classList.toggle('bi-eye-slash');
    });
  }

  // --- Soumission du formulaire ---
  formConnexion.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const motDePasse = document.getElementById('motDePasse').value.trim();

    if (!email || !motDePasse) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    // Validation simple du format email
    const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatEmail.test(email)) {
      alert('Veuillez saisir une adresse email valide.');
      document.getElementById('email').focus();
      return;
    }

    // Ici : appel API d'authentification (à brancher plus tard)
    console.log('Tentative de connexion :', { email });

    // Redirection simulée vers le dashboard
    window.location.href = 'dashbord.html';
  });

}

// ----------------------------
// DASHBOARD
// ----------------------------
const tableDashboard = document.getElementById('tableDashboard');

if (tableDashboard) {

  // --- Boutons Démarrer / Terminer ---
  tableDashboard.querySelectorAll('.btn-action').forEach(btn => {
    if (btn.textContent.includes('Démarrer') || btn.textContent.includes('Terminer')) {
      btn.addEventListener('click', () => {
        const ligne = btn.closest('tr');
        const badge = ligne.querySelector('.badge');

        if (btn.textContent.includes('Démarrer')) {
          badge.textContent = 'EN COURS';
          badge.className = 'badge badge-encours';
          btn.textContent = 'Terminer';
          btn.classList.remove('btn-primary');
          btn.classList.add('btn-outline-primary');
        } else if (btn.textContent.includes('Terminer')) {
          badge.textContent = 'TERMINÉ';
          badge.className = 'badge badge-termine';
          btn.outerHTML = `
            <a href="detailcommandefacture.html" class="btn btn-sm btn-outline-secondary btn-action">
              <i class="bi bi-receipt me-1"></i> Facturer
            </a>
          `;
        }
      });
    }
  });

  // --- Bouton Nouveau Client (dashboard) ---
  const btnNouveauClientDash = document.getElementById('btnNouveauClientDash');
  if (btnNouveauClientDash) {
    btnNouveauClientDash.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'formulaireclient.html';
    });
  }

}

// ----------------------------
// GRAPHIQUE DONUT (Canvas natif)
// ----------------------------
const chartPrestations = document.getElementById('chartPrestations');

if (chartPrestations) {
  const ctx = chartPrestations.getContext('2d');

  const donnees = [
    { label: 'Lavage Complet', valeur: 55, couleur: '#0d6efd' },
    { label: 'Lavage Simple', valeur: 30, couleur: '#74b9ff' },
    { label: 'Nettoyage Moteur', valeur: 15, couleur: '#e9ecef' }
  ];

  function dessinerDonut() {
    const centreX = chartPrestations.width / 2;
    const centreY = chartPrestations.height / 2;
    const rayonExterieur = 80;
    const rayonInterieur = 55;

    let angleDepart = -Math.PI / 2; // Commence en haut

    ctx.clearRect(0, 0, chartPrestations.width, chartPrestations.height);

    donnees.forEach(segment => {
      const angleSegment = (segment.valeur / 100) * (Math.PI * 2);
      const angleFin = angleDepart + angleSegment;

      ctx.beginPath();
      ctx.arc(centreX, centreY, rayonExterieur, angleDepart, angleFin);
      ctx.arc(centreX, centreY, rayonInterieur, angleFin, angleDepart, true);
      ctx.closePath();
      ctx.fillStyle = segment.couleur;
      ctx.fill();

      angleDepart = angleFin;
    });

    // Texte central
    const total = donnees.reduce((sum, s) => sum + s.valeur, 0);
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 24px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, centreX, centreY - 8);

    ctx.font = '11px Segoe UI';
    ctx.fillStyle = '#6c757d';
    ctx.fillText('TOTAL', centreX, centreY + 14);
  }

  dessinerDonut();
}

// ----------------------------
// LISTE DES CLIENTS
// ----------------------------
const listeClients = document.getElementById('listeClients');

if (listeClients) {

  const rechercheClient = document.getElementById('rechercheClient');
  const triClients = document.getElementById('triClients');
  const filtreFidelite = document.getElementById('filtreFidelite');
  const btnExporter = document.getElementById('btnExporter');

  const cartesClients = () => listeClients.querySelectorAll('.client-card');

  // --- Recherche par nom ---
  if (rechercheClient) {
    rechercheClient.addEventListener('input', () => {
      const terme = rechercheClient.value.trim().toLowerCase();

      cartesClients().forEach(carte => {
        const nom = carte.querySelector('h6').textContent.toLowerCase();
        carte.closest('.col-md-6').style.display = nom.includes(terme) ? '' : 'none';
      });
    });
  }

  // --- Tri des clients ---
  if (triClients) {
    triClients.addEventListener('change', () => {
      const critere = triClients.value;
      const colonnes = Array.from(listeClients.querySelectorAll('.col-md-6.col-lg-4'))
        .filter(col => col.querySelector('.client-card')); // exclut la carte "Nouveau Client"

      colonnes.sort((a, b) => {
        if (critere === 'nom') {
          const nomA = a.querySelector('h6').textContent;
          const nomB = b.querySelector('h6').textContent;
          return nomA.localeCompare(nomB);
        }
        if (critere === 'commandes') {
          const cmdA = parseInt(a.querySelectorAll('.fw-bold.fs-5')[1].textContent);
          const cmdB = parseInt(b.querySelectorAll('.fw-bold.fs-5')[1].textContent);
          return cmdB - cmdA;
        }
        return 0;
      });

      colonnes.forEach(col => listeClients.insertBefore(col, listeClients.lastElementChild));
    });
  }

  // --- Export (simulation) ---
  if (btnExporter) {
    btnExporter.addEventListener('click', () => {
      alert('Export du répertoire clients en cours... (CSV/Excel à connecter plus tard)');
    });
  }

  // --- Clic sur une carte client → détail (à venir) ---
  cartesClients().forEach(carte => {
    carte.style.cursor = 'pointer';
    carte.addEventListener('click', (e) => {
      // Évite le conflit si un jour on ajoute des boutons internes à la carte
      const nom = carte.querySelector('h6').textContent.trim();
      console.log('Client sélectionné :', nom);
      // window.location.href = `formulaireclient.html?client=${encodeURIComponent(nom)}`;
    });
  });

}

// ----------------------------
// FORMULAIRE CLIENT (Modale)
// ----------------------------
const formClient = document.getElementById('formClient');

if (formClient) {

  // --- Fermer la modale (X ou Annuler) ---
  const btnFermerModal = document.getElementById('btnFermerModal');
  const btnAnnulerClient = document.getElementById('btnAnnulerClient');

  function fermerModale() {
    if (confirm('Voulez-vous vraiment fermer sans enregistrer ?')) {
      window.location.href = 'listedesclients.html';
    }
  }

  if (btnFermerModal) {
    btnFermerModal.addEventListener('click', fermerModale);
  }

  if (btnAnnulerClient) {
    btnAnnulerClient.addEventListener('click', fermerModale);
  }

  // --- Soumission du formulaire ---
  formClient.addEventListener('submit', (e) => {
    e.preventDefault();

    const typeClient = document.querySelector('input[name="typeClient"]:checked').value;
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const email = document.getElementById('emailClient').value.trim();
    const quartier = document.getElementById('quartier').value.trim();
    const notes = document.getElementById('notesInternes').value.trim();

    // Validation des champs obligatoires
    if (!nom || !prenom) {
      alert('Veuillez renseigner le nom et le prénom du client.');
      return;
    }

    if (!telephone) {
      alert('Veuillez renseigner le téléphone principal.');
      document.getElementById('telephone').focus();
      return;
    }

    // Validation email si renseigné
    if (email) {
      const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formatEmail.test(email)) {
        alert('Veuillez saisir une adresse email valide.');
        document.getElementById('emailClient').focus();
        return;
      }
    }

    const client = {
      typeClient,
      nom,
      prenom,
      telephone,
      whatsapp,
      email,
      quartier,
      notes
    };

    console.log('Client enregistré :', client);

    // Ici : appel API / sauvegarde (à brancher plus tard)
    alert('Client enregistré avec succès !');
    window.location.href = 'listedesclients.html';
  });

}

// ----------------------------
// LISTE DES VÉHICULES
// ----------------------------
const tableVehicules = document.getElementById('tableVehicules');

if (tableVehicules) {

  const inputRecherche = document.querySelector('.topbar-search input');
  const filtreCategorie = document.getElementById('filtreCategorie');
  const lignes = tableVehicules.querySelectorAll('tbody tr');

  // --- Recherche par plaque, marque, propriétaire ---
  if (inputRecherche) {
    inputRecherche.addEventListener('input', () => {
      const terme = inputRecherche.value.trim().toLowerCase();

      lignes.forEach(ligne => {
        const texteComplet = ligne.textContent.toLowerCase();
        ligne.style.display = texteComplet.includes(terme) ? '' : 'none';
      });
    });
  }

  // --- Filtre par catégorie ---
  if (filtreCategorie) {
    filtreCategorie.addEventListener('change', () => {
      const categorie = filtreCategorie.value.toLowerCase();

      lignes.forEach(ligne => {
        const badgeCategorie = ligne.querySelector('td:nth-child(3) .badge');
        const texteCategorie = badgeCategorie ? badgeCategorie.textContent.trim().toLowerCase() : '';

        if (!categorie) {
          ligne.style.display = '';
        } else {
          ligne.style.display = texteCategorie === categorie ? '' : 'none';
        }
      });
    });
  }

  // --- Bouton "Historique lavages" (icône goutte) ---
  tableVehicules.querySelectorAll('.btn-icon[title="Historique lavages"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ligne = btn.closest('tr');
      const plaque = ligne.querySelector('td:first-child').textContent.trim();
      window.location.href = `listedescommandes.html?vehicule=${encodeURIComponent(plaque)}`;
    });
  });

  // --- Bouton "Plus d'options" (3 points) ---
  tableVehicules.querySelectorAll('.btn-icon[title="Plus d\'options"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ligne = btn.closest('tr');
      const plaque = ligne.querySelector('td:first-child').textContent.trim();

      const confirmation = confirm(`Supprimer le véhicule ${plaque} du répertoire ?`);
      if (confirmation) {
        ligne.remove();
        alert('Véhicule supprimé.');
      }
    });
  });

}

// ----------------------------
// PAGE PARAMÈTRES
// ----------------------------
const formParametres = document.getElementById('formParametres');

if (formParametres) {

  // --- Aperçu du logo sélectionné ---
  const inputLogo = document.getElementById('inputLogo');
  const logoPreview = document.getElementById('logoPreview');

  if (inputLogo && logoPreview) {
    inputLogo.addEventListener('change', (e) => {
      const fichier = e.target.files[0];
      if (fichier) {
        const lecteur = new FileReader();
        lecteur.onload = (event) => {
          logoPreview.src = event.target.result;
        };
        lecteur.readAsDataURL(fichier);
      }
    });
  }

  // --- Bouton Annuler ---
  const btnAnnulerParams = document.getElementById('btnAnnulerParams');
  if (btnAnnulerParams) {
    btnAnnulerParams.addEventListener('click', () => {
      if (confirm('Annuler les modifications non enregistrées ?')) {
        formParametres.reset();
        logoPreview.src = 'images/logo-bide.png';
      }
    });
  }

  // --- Soumission du formulaire ---
  formParametres.addEventListener('submit', (e) => {
    e.preventDefault();

    const parametres = {
      nom: document.getElementById('nomEntreprise').value.trim(),
      nif: document.getElementById('nifEntreprise').value.trim(),
      adresse: document.getElementById('adresseEntreprise').value.trim(),
      telephone: document.getElementById('telephoneEntreprise').value.trim(),
      email: document.getElementById('emailEntreprise').value.trim(),
      tauxTva: parseFloat(document.getElementById('tauxTva').value),
      devise: document.getElementById('devise').value
    };

    if (!parametres.nom || !parametres.adresse || !parametres.telephone) {
      alert('Veuillez remplir les champs obligatoires (nom, adresse, téléphone).');
      return;
    }

    console.log('Paramètres enregistrés :', parametres);

    // Ici : appel API / sauvegarde (à brancher plus tard)
    alert('Paramètres enregistrés avec succès !');
  });

}

// ----------------------------
// STATISTIQUES - Graphiques Canvas
// ----------------------------

// --- Graphique 1 : Évolution du CA (courbe) ---
const chartEvolutionCA = document.getElementById('chartEvolutionCA');

if (chartEvolutionCA) {
  const ctx = chartEvolutionCA.getContext('2d');

  const donneesCA = [45000, 62000, 58000, 71000, 85000, 79000, 92000, 88000, 95000, 102000, 98000, 110000];
  const labelsCA = ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10', 'J11', 'J12'];

  function dessinerCourbe() {
    const largeur = chartEvolutionCA.width = chartEvolutionCA.offsetWidth;
    const hauteur = chartEvolutionCA.height;
    const padding = 30;
    const max = Math.max(...donneesCA) * 1.1;

    ctx.clearRect(0, 0, largeur, hauteur);

    const pasX = (largeur - padding * 2) / (donneesCA.length - 1);

    // Zone remplie sous la courbe
    ctx.beginPath();
    ctx.moveTo(padding, hauteur - padding);
    donneesCA.forEach((valeur, i) => {
      const x = padding + i * pasX;
      const y = hauteur - padding - (valeur / max) * (hauteur - padding * 2);
      ctx.lineTo(x, y);
    });
    ctx.lineTo(padding + (donneesCA.length - 1) * pasX, hauteur - padding);
    ctx.closePath();
    ctx.fillStyle = 'rgba(13, 110, 253, 0.08)';
    ctx.fill();

    // Ligne de la courbe
    ctx.beginPath();
    donneesCA.forEach((valeur, i) => {
      const x = padding + i * pasX;
      const y = hauteur - padding - (valeur / max) * (hauteur - padding * 2);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#0d6efd';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Points
    donneesCA.forEach((valeur, i) => {
      const x = padding + i * pasX;
      const y = hauteur - padding - (valeur / max) * (hauteur - padding * 2);
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#0d6efd';
      ctx.fill();
    });

    // Labels axe X
    ctx.fillStyle = '#6c757d';
    ctx.font = '10px Segoe UI';
    ctx.textAlign = 'center';
    labelsCA.forEach((label, i) => {
      const x = padding + i * pasX;
      ctx.fillText(label, x, hauteur - 8);
    });
  }

  dessinerCourbe();
  window.addEventListener('resize', dessinerCourbe);
}

// --- Graphique 2 : Commandes par jour (barres) ---
const chartCommandesJour = document.getElementById('chartCommandesJour');

if (chartCommandesJour) {
  const ctx2 = chartCommandesJour.getContext('2d');

  const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const donneesJours = [18, 22, 15, 25, 32, 45, 28];

  function dessinerBarres() {
    const largeur = chartCommandesJour.width = chartCommandesJour.offsetWidth;
    const hauteur = chartCommandesJour.height;
    const padding = 30;
    const max = Math.max(...donneesJours) * 1.2;

    ctx2.clearRect(0, 0, largeur, hauteur);

    const largeurBarre = (largeur - padding * 2) / donneesJours.length * 0.6;
    const espacement = (largeur - padding * 2) / donneesJours.length;

    donneesJours.forEach((valeur, i) => {
      const x = padding + i * espacement + (espacement - largeurBarre) / 2;
      const hauteurBarre = (valeur / max) * (hauteur - padding * 2);
      const y = hauteur - padding - hauteurBarre;

      // Barre arrondie en haut
      ctx2.beginPath();
      ctx2.roundRect(x, y, largeurBarre, hauteurBarre, [4, 4, 0, 0]);
      ctx2.fillStyle = '#0d6efd';
      ctx2.fill();

      // Valeur au-dessus de la barre
      ctx2.fillStyle = '#495057';
      ctx2.font = 'bold 11px Segoe UI';
      ctx2.textAlign = 'center';
      ctx2.fillText(valeur, x + largeurBarre / 2, y - 6);

      // Label jour
      ctx2.fillStyle = '#6c757d';
      ctx2.font = '11px Segoe UI';
      ctx2.fillText(jours[i], x + largeurBarre / 2, hauteur - 8);
    });
  }

  dessinerBarres();
  window.addEventListener('resize', dessinerBarres);
}

// ----------------------------
// GESTION DES PRESTATIONS (CRUD Admin)
// ----------------------------
const listePrestationsAdmin = document.getElementById('listePrestationsAdmin');

if (listePrestationsAdmin) {

  const modalPrestation = document.getElementById('modalPrestation');
  const modalPrestationTitre = document.getElementById('modalPrestationTitre');
  const formPrestation = document.getElementById('formPrestation');
  const btnAjouterPrestation = document.getElementById('btnAjouterPrestation');

  let carteEnCoursDeModification = null;

  // --- Ouverture pour AJOUT ---
  btnAjouterPrestation.addEventListener('click', () => {
    carteEnCoursDeModification = null;
    modalPrestationTitre.textContent = 'Nouvelle prestation';
    formPrestation.reset();
  });

  // --- Ouverture pour MODIFICATION ---
  listePrestationsAdmin.querySelectorAll('.btn-modifier-prestation').forEach(btn => {
    btn.addEventListener('click', () => {
      const carte = btn.closest('.col-md-6, .col-lg-4');
      carteEnCoursDeModification = carte;

      modalPrestationTitre.textContent = 'Modifier la prestation';

      const nom = carte.querySelector('h5').textContent.trim();
      const description = carte.querySelector('p.text-muted').textContent.trim();
      const duree = carte.querySelector('.text-muted i.bi-clock').parentElement.textContent
        .replace(/.*bi-clock.*?\s/, '').trim();
      const prix = carte.querySelector('.prestation-prix').textContent.replace(/\D/g, '');
      const categorie = carte.querySelector('.badge-tag').textContent.trim();

      document.getElementById('nomPrestation').value = nom;
      document.getElementById('descriptionPrestation').value = description;
      document.getElementById('dureePrestation').value = duree;
      document.getElementById('prixPrestation').value = prix;
      document.getElementById('categoriePrestation').value = categorie;
    });
  });

  // --- SUPPRESSION ---
  listePrestationsAdmin.querySelectorAll('.btn-supprimer-prestation').forEach(btn => {
    btn.addEventListener('click', () => {
      const carte = btn.closest('.col-md-6, .col-lg-4');
      const nom = carte.querySelector('h5').textContent.trim();

      if (confirm(`Voulez-vous vraiment supprimer la prestation "${nom}" ?`)) {
        carte.remove();
      }
    });
  });

  // --- Fonction pour créer le HTML d'une carte prestation ---
  function creerCartePrestation(id, data) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.dataset.id = id;

    col.innerHTML = `
      <div class="card prestation-card p-4 h-100">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div class="prestation-icon bg-light-blue"><i class="bi bi-droplet-fill"></i></div>
          <span class="badge badge-tag">${data.categorie}</span>
        </div>
        <h5 class="fw-bold">${data.nom}</h5>
        <p class="text-muted">${data.description}</p>
        <hr class="mt-auto">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-muted"><i class="bi bi-clock me-1"></i> ${data.duree}</span>
          <span class="prestation-prix">${parseInt(data.prix).toLocaleString('fr-FR')} FCFA</span>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-primary flex-fill btn-modifier-prestation" data-bs-toggle="modal" data-bs-target="#modalPrestation">
            <i class="bi bi-pencil me-1"></i> Modifier
          </button>
          <button class="btn btn-sm btn-outline-danger btn-supprimer-prestation">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    `;

    // Rattacher les événements sur la nouvelle carte
    col.querySelector('.btn-modifier-prestation').addEventListener('click', () => {
      carteEnCoursDeModification = col;
      modalPrestationTitre.textContent = 'Modifier la prestation';
      document.getElementById('nomPrestation').value = data.nom;
      document.getElementById('descriptionPrestation').value = data.description;
      document.getElementById('dureePrestation').value = data.duree;
      document.getElementById('prixPrestation').value = data.prix;
      document.getElementById('categoriePrestation').value = data.categorie;
    });

    col.querySelector('.btn-supprimer-prestation').addEventListener('click', () => {
      if (confirm(`Voulez-vous vraiment supprimer la prestation "${data.nom}" ?`)) {
        col.remove();
      }
    });

    return col;
  }

  // --- Soumission du formulaire (ajout ou modification) ---
  formPrestation.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      nom: document.getElementById('nomPrestation').value.trim(),
      description: document.getElementById('descriptionPrestation').value.trim(),
      duree: document.getElementById('dureePrestation').value.trim(),
      prix: document.getElementById('prixPrestation').value,
      categorie: document.getElementById('categoriePrestation').value
    };

    if (!data.nom || !data.description || !data.duree || !data.prix) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    if (carteEnCoursDeModification) {
      // Mise à jour d'une carte existante
      carteEnCoursDeModification.querySelector('h5').textContent = data.nom;
      carteEnCoursDeModification.querySelector('p.text-muted').textContent = data.description;
      carteEnCoursDeModification.querySelector('.badge-tag').textContent = data.categorie;
      carteEnCoursDeModification.querySelector('.text-muted i.bi-clock').parentElement.innerHTML =
        `<i class="bi bi-clock me-1"></i> ${data.duree}`;
      carteEnCoursDeModification.querySelector('.prestation-prix').textContent =
        `${parseInt(data.prix).toLocaleString('fr-FR')} FCFA`;
    } else {
      // Ajout d'une nouvelle carte
      const nouvelId = Date.now();
      const nouvelleCarte = creerCartePrestation(nouvelId, data);
      listePrestationsAdmin.appendChild(nouvelleCarte);
    }

    // Fermer la modale
    const instanceModal = bootstrap.Modal.getInstance(modalPrestation);
    instanceModal.hide();

    formPrestation.reset();
    carteEnCoursDeModification = null;
  });

}

// ----------------------------
// FAQ (CRUD Admin)
// ----------------------------
const accordionFaq = document.getElementById('accordionFaq');

if (accordionFaq) {

  const modalFaq = document.getElementById('modalFaq');
  const modalFaqTitre = document.getElementById('modalFaqTitre');
  const formFaq = document.getElementById('formFaq');
  const btnAjouterFaq = document.getElementById('btnAjouterFaq');

  let itemEnCoursDeModification = null;
  let compteurFaq = accordionFaq.querySelectorAll('.faq-item').length;

  // --- Ouverture pour AJOUT ---
  btnAjouterFaq.addEventListener('click', () => {
    itemEnCoursDeModification = null;
    modalFaqTitre.textContent = 'Nouvelle question';
    formFaq.reset();
  });

  // --- Rattacher les événements Modifier/Supprimer sur un item ---
  function attacherEvenements(item) {
    const btnModifier = item.querySelector('.btn-modifier-faq');
    const btnSupprimer = item.querySelector('.btn-supprimer-faq');

    btnModifier.addEventListener('click', (e) => {
      e.stopPropagation();
      itemEnCoursDeModification = item;
      modalFaqTitre.textContent = 'Modifier la question';

      const question = item.querySelector('.accordion-button').textContent.trim();
      const reponse = item.querySelector('.accordion-body span').textContent.trim();

      document.getElementById('questionFaq').value = question;
      document.getElementById('reponseFaq').value = reponse;
    });

    btnSupprimer.addEventListener('click', (e) => {
      e.stopPropagation();
      const question = item.querySelector('.accordion-button').textContent.trim();

      if (confirm(`Supprimer la question "${question}" ?`)) {
        item.remove();
      }
    });
  }

  // Attacher les événements aux items déjà présents
  accordionFaq.querySelectorAll('.faq-item').forEach(item => attacherEvenements(item));

  // --- Créer le HTML d'un nouvel item FAQ ---
  function creerItemFaq(id, data) {
    const item = document.createElement('div');
    item.className = 'accordion-item faq-item';
    item.dataset.id = id;

    item.innerHTML = `
      <h2 class="accordion-header">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq${id}">
          ${data.question}
        </button>
      </h2>
      <div id="faq${id}" class="accordion-collapse collapse" data-bs-parent="#accordionFaq">
        <div class="accordion-body d-flex justify-content-between align-items-start">
          <span>${data.reponse}</span>
          <div class="d-flex gap-2 ms-3">
            <button class="btn btn-sm btn-outline-primary btn-modifier-faq" data-bs-toggle="modal" data-bs-target="#modalFaq">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger btn-supprimer-faq">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    attacherEvenements(item);
    return item;
  }

  // --- Soumission du formulaire (ajout ou modification) ---
  formFaq.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
      question: document.getElementById('questionFaq').value.trim(),
      reponse: document.getElementById('reponseFaq').value.trim()
    };

    if (!data.question || !data.reponse) {
      alert('Veuillez remplir la question et la réponse.');
      return;
    }

    if (itemEnCoursDeModification) {
      // Mise à jour d'un item existant
      itemEnCoursDeModification.querySelector('.accordion-button').textContent = data.question;
      itemEnCoursDeModification.querySelector('.accordion-body span').textContent = data.reponse;
    } else {
      // Ajout d'un nouvel item
      compteurFaq++;
      const nouvelItem = creerItemFaq(compteurFaq, data);
      accordionFaq.appendChild(nouvelItem);
    }

    // Fermer la modale
    const instanceModal = bootstrap.Modal.getInstance(modalFaq);
    instanceModal.hide();

    formFaq.reset();
    itemEnCoursDeModification = null;
  });

}