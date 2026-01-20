// src/App.jsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, Box, Typography, Card, CardContent, Button, 
  TextField, FormControl, Radio, RadioGroup, FormControlLabel, 
  Snackbar, Alert, Stack, Divider, Chip
} from '@mui/material';
import { Save, Smartphone, Wifi, MapPin, CheckCircle, Download, Trash2, DollarSign, User, MessageCircle } from 'lucide-react';

// --- THÈME "YÉLY COMMANDO" (Lisibilité Maximale) ---
let darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#FFD700' }, // Jaune Or
    background: { default: '#000000', paper: '#121212' },
    text: { primary: '#ffffff', secondary: '#bbbbbb' },
  },
  typography: {
    fontFamily: '"Roboto Condensed", sans-serif',
    h6: { fontWeight: 800, color: '#FFD700', textTransform: 'uppercase', fontSize: '1rem' },
    body1: { fontSize: '1.15rem', lineHeight: 1.4 }, // Texte du script bien gros
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '16px', fontSize: '1.1rem', fontWeight: 900 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, border: '1px solid #333', marginBottom: 20, backgroundColor: '#181818' },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: { 
          border: '1px solid #444', 
          borderRadius: 8, 
          margin: '6px 0', 
          padding: '8px 12px',
          backgroundColor: '#252525',
          width: '100%',
          marginLeft: 0,
        },
        label: { width: '100%', fontSize: '1rem', fontWeight: 500 }
      }
    },
    MuiRadio: { styleOverrides: { root: { color: '#666', '&.Mui-checked': { color: '#FFD700' } } } }
  },
});
darkTheme = responsiveFontSizes(darkTheme);

function App() {
  const [surveys, setSurveys] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  
  // État du formulaire
  const initialForm = { 
    q1_douleur: '', q2_equipement: '', q3_offre: '', q4_paiement: '', 
    q6_data: '', q7_nav: '', nom: '', telephone: '' 
  };
  const [formData, setFormData] = useState(initialForm);

  // Chargement LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('yely_final_db');
    if (saved) setSurveys(JSON.parse(saved));
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { id: Date.now(), date: new Date().toLocaleString(), ...formData };
    const newList = [...surveys, newEntry];
    setSurveys(newList);
    localStorage.setItem('yely_final_db', JSON.stringify(newList));
    setFormData(initialForm);
    setOpenSnack(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    if (surveys.length === 0) return alert("Rien à exporter !");
    const headers = ["ID", "Date", "Nom", "Tel", "Q1.Douleur", "Q2.Equipement", "Q3.Offre", "Q4.Paiement", "Q6.Data", "Q7.Nav"];
    const csv = surveys.map(row => [
      row.id, `"${row.date}"`, `"${row.nom}"`, `"${row.telephone}"`, 
      `"${row.q1_douleur}"`, `"${row.q2_equipement}"`, `"${row.q3_offre}"`, 
      `"${row.q4_paiement}"`, `"${row.q6_data}"`, `"${row.q7_nav}"`
    ].join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + headers.join(",") + "\n" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `YELY_TERRAIN_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
  };

  const handleReset = () => { if(window.confirm("⚠️ VIDER TOUTE LA MÉMOIRE ?")) { localStorage.removeItem('yely_final_db'); setSurveys([]); }};

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 3, pb: 15 }}>
        
        {/* HEADER */}
        <Box textAlign="center" mb={4} borderBottom="2px solid #FFD700" pb={2}>
          <Typography variant="h3" color="primary" fontWeight={900} letterSpacing={-2}>YÉLY</Typography>
          <Typography variant="subtitle2" letterSpacing={2} color="text.secondary">ENQUÊTE TERRAIN • MAFÉRÉ</Typography>
          <Chip label={`${surveys.length} Validés`} color="primary" sx={{ mt: 1, fontWeight: 'bold' }} />
        </Box>

        <form onSubmit={handleSubmit}>
          
          {/* Q1: DOULEUR */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Save color="#FFD700" size={24} />
                <Typography variant="h6">Q1. LA DOULEUR</Typography>
              </Stack>
              <Typography variant="body1" sx={{ color: '#fff', fontStyle: 'italic', mb: 2, borderLeft: '4px solid #FFD700', pl: 2 }}>
                "Chef, honnêtement, dans la journée, tu perds combien de temps à rouler à vide ou à attendre le client à la gare ?"
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup name="q1_douleur" value={formData.q1_douleur} onChange={handleChange}>
                  <FormControlLabel value="<1h" control={<Radio />} label="Moins de 1h" />
                  <FormControlLabel value="1h-3h" control={<Radio />} label="🔥 1h à 3h (CIBLE !)" sx={{ border: '1px solid #FFD700', bgcolor: '#332b00' }} />
                  <FormControlLabel value=">3h" control={<Radio />} label="Plus de 3h" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Q2: EQUIPEMENT */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Smartphone color="#FFD700" size={24} />
                <Typography variant="h6">Q2. L'ÉQUIPEMENT</Typography>
              </Stack>
              <Typography variant="body1" sx={{ color: '#fff', fontStyle: 'italic', mb: 2, borderLeft: '4px solid #FFD700', pl: 2 }}>
                "Est-ce que tu as un téléphone Android (Tactile) avec un peu de connexion internet ?"
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup name="q2_equipement" value={formData.q2_equipement} onChange={handleChange}>
                  <FormControlLabel value="Oui (Android)" control={<Radio />} label="✅ Oui (Android)" sx={{ border: '1px solid #FFD700', bgcolor: '#332b00' }} />
                  <FormControlLabel value="Non (Touche)" control={<Radio color="error" />} label="❌ Non (Petit téléphone)" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Q3: OFFRE */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <DollarSign color="#FFD700" size={24} />
                <Typography variant="h6">Q3. L'OFFRE (200F)</Typography>
              </Stack>
              <Typography variant="body1" sx={{ color: '#fff', fontStyle: 'italic', mb: 2, borderLeft: '4px solid #FFD700', pl: 2 }}>
                "Si on te donne une application qui te montre où sont les clients cachés... est-ce que tu es prêt à payer 200F par jour ?"
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup name="q3_offre" value={formData.q3_offre} onChange={handleChange}>
                  <FormControlLabel value="Oui, direct" control={<Radio />} label="🔥 Oui, direct." sx={{ border: '1px solid #FFD700', bgcolor: '#332b00' }} />
                  <FormControlLabel value="A voir" control={<Radio />} label="🤔 Je dois voir pour croire." />
                  <FormControlLabel value="Non" control={<Radio color="error" />} label="❌ Non, c'est trop cher." />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Q4: PAIEMENT */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <DollarSign color="#FFD700" size={24} />
                <Typography variant="h6">Q4. PAIEMENT</Typography>
              </Stack>
              <Typography variant="body1" sx={{ color: '#fff', fontStyle: 'italic', mb: 2, borderLeft: '4px solid #FFD700', pl: 2 }}>
                "Si tu dois payer ces 200F, tu préfères le faire comment ?"
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup name="q4_paiement" value={formData.q4_paiement} onChange={handleChange} row>
                  <FormControlLabel value="Wave" control={<Radio />} label="🌊 Wave" sx={{ width: '48%', mr: 1 }} />
                  <FormControlLabel value="Espèces" control={<Radio />} label="💵 Espèces" sx={{ width: '48%' }} />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Q6: DATA */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Wifi color="#FFD700" size={24} />
                <Typography variant="h6">Q6. RÉALITÉ DATA</Typography>
              </Stack>
              <Typography variant="body1" sx={{ color: '#fff', fontStyle: 'italic', mb: 2, borderLeft: '4px solid #FFD700', pl: 2 }}>
                "Vieux père, pour internet là, tu as la connexion allumée toute la journée, ou bien tu actives seulement quand tu vas sur WhatsApp ?"
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup name="q6_data" value={formData.q6_data} onChange={handleChange}>
                  <FormControlLabel value="H24" control={<Radio />} label="Allumée H24 (Bon Pass)" />
                  <FormControlLabel value="Economie" control={<Radio />} label="Je coupe pour économiser" />
                  <FormControlLabel value="Galere" control={<Radio />} label="C'est compliqué (Pas d'unités)" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Q7: NAVIGATION */}
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <MapPin color="#FFD700" size={24} />
                <Typography variant="h6">Q7. TEST NAVIGATION</Typography>
              </Stack>
              <Typography variant="body1" sx={{ color: '#fff', fontStyle: 'italic', mb: 2, borderLeft: '4px solid #FFD700', pl: 2 }}>
                "Soyons honnêtes. Si un client t'envoie sa position sur la carte... tu préfères qu'il t'envoie une note vocale ?"
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup name="q7_nav" value={formData.q7_nav} onChange={handleChange}>
                  <FormControlLabel value="GPS" control={<Radio />} label="🗺️ La Carte GPS c'est bon" />
                  <FormControlLabel value="Vocal" control={<Radio />} label="🎤 Je préfère Note Vocale" />
                  <FormControlLabel value="Nul" control={<Radio />} label="❌ Je ne sais pas lire la carte" />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>

          {/* Q5: LEAD / CONTACT */}
          <Box sx={{ border: '2px solid #FFD700', borderRadius: 4, p: 3, bgcolor: '#1a1a00', mt: 4, mb: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <User color="#FFD700" size={28} />
              <Typography variant="h6">Q5. LISTE VIP (LEAD)</Typography>
            </Stack>
            <Typography variant="body1" sx={{ color: '#FFD700', fontWeight: 'bold', fontStyle: 'italic', mb: 3 }}>
              "Merci beaucoup pour ton temps. C'est quoi ton numéro WhatsApp ?"
            </Typography>
            
            <TextField 
              fullWidth label="NOM DU CHAUFFEUR" name="nom" variant="filled" 
              value={formData.nom} onChange={handleChange} required 
              sx={{ mb: 2, bgcolor: '#333', borderRadius: 1 }} 
            />
            <TextField 
              fullWidth label="NUMÉRO WHATSAPP" name="telephone" type="tel" variant="filled" 
              value={formData.telephone} onChange={handleChange} required 
              sx={{ bgcolor: '#333', borderRadius: 1 }} 
            />
          </Box>

          {/* ACTION */}
          <Button type="submit" variant="contained" color="primary" fullWidth size="large" startIcon={<CheckCircle />}>
            ENREGISTRER CE CHAUFFEUR
          </Button>

        </form>

        {/* ADMIN */}
        <Box mt={8} pt={4} borderTop="1px solid #333" display="flex" justifyContent="center" gap={2} opacity={0.5}>
          <Button variant="outlined" color="inherit" size="small" startIcon={<Download />} onClick={handleExport}>CSV</Button>
          <Button variant="text" color="error" size="small" startIcon={<Trash2 />} onClick={handleReset}>RAZ</Button>
        </Box>

        <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => setOpenSnack(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" variant="filled" sx={{ width: '100%', fontSize: '1.2rem', fontWeight: 'bold', bgcolor: '#FFD700', color: 'black' }}>
            🎉 Enregistré ! Au suivant !
          </Alert>
        </Snackbar>

      </Container>
    </ThemeProvider>
  );
}

export default App;