// src/App.jsx
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  Container, Box, Typography, Card, CardContent, Button, 
  TextField, Select, MenuItem, FormControl, InputLabel, 
  Radio, RadioGroup, FormControlLabel, Snackbar, Alert, Stack, Divider 
} from '@mui/material';
import { Save, Smartphone, Wifi, MapPin, CheckCircle, Download, Trash2, DollarSign } from 'lucide-react';

// --- THÈME "YÉLY" (DARK & GOLD) ---
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFD700', // Jaune Or
    },
    background: {
      default: '#0a0a0a', // Noir profond
      paper: '#1e1e1e',   // Gris foncé pour les cartes
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-1px' },
    button: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '12px 24px' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16, border: '1px solid #333' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: { marginBottom: 16 },
      },
    }
  },
});

function App() {
  // --- ÉTAT ---
  const [surveys, setSurveys] = useState([]);
  const [openSnack, setOpenSnack] = useState(false);
  
  const initialForm = {
    nom: '', telephone: '', q1_temps: '', q2_equipement: '', 
    q3_abo: '', q4_paiement: '', q6_data: '', q7_nav: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // --- CHARGEMENT ---
  useEffect(() => {
    const saved = localStorage.getItem('yely_mui_db');
    if (saved) setSurveys(JSON.parse(saved));
  }, []);

  // --- LOGIQUE ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = { id: Date.now(), date: new Date().toLocaleString(), ...formData };
    const newList = [...surveys, newEntry];
    setSurveys(newList);
    localStorage.setItem('yely_mui_db', JSON.stringify(newList));
    setFormData(initialForm);
    setOpenSnack(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExport = () => {
    if (surveys.length === 0) return alert("Rien à exporter !");
    const headers = ["ID", "Date", "Nom", "Tel", "Temps Perdu", "Equipement", "Abo 200F", "Paiement", "Data", "Nav"];
    const csv = surveys.map(row => [
      row.id, `"${row.date}"`, `"${row.nom}"`, `"${row.telephone}"`, 
      `"${row.q1_temps}"`, `"${row.q2_equipement}"`, `"${row.q3_abo}"`, 
      `"${row.q4_paiement}"`, `"${row.q6_data}"`, `"${row.q7_nav}"`
    ].join(",")).join("\n");
    
    const blob = new Blob(["\uFEFF" + headers.join(",") + "\n" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Enquete_Yely_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`;
    link.click();
  };

  const handleReset = () => {
    if(window.confirm("Tout effacer ?")) {
      localStorage.removeItem('yely_mui_db');
      setSurveys([]);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ py: 4, pb: 10 }}>
        
        {/* HEADER */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" color="primary">YÉLY</Typography>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 3 }}>
            Enquête Maféré • {surveys.length} Recueilli(s)
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            
            {/* Q1: DOULEUR */}
            <Card elevation={4}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Save size={20} color="#FFD700" />
                  <Typography variant="h6" fontSize={16} fontWeight="bold">Q1. TEMPS PERDU</Typography>
                </Stack>
                <FormControl fullWidth size="small">
                  <InputLabel>Combien de temps perdu ?</InputLabel>
                  <Select name="q1_temps" value={formData.q1_temps} label="Combien de temps perdu ?" onChange={handleChange} required>
                    <MenuItem value="<1h">Moins de 1h</MenuItem>
                    <MenuItem value="1h-3h">1h à 3h (CIBLE)</MenuItem>
                    <MenuItem value=">3h">Plus de 3h</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>

            {/* Q2: EQUIPEMENT */}
            <Card elevation={4}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <Smartphone size={20} color="#FFD700" />
                  <Typography variant="h6" fontSize={16} fontWeight="bold">Q2. ÉQUIPEMENT</Typography>
                </Stack>
                <FormControl component="fieldset">
                  <RadioGroup name="q2_equipement" value={formData.q2_equipement} onChange={handleChange}>
                    <FormControlLabel value="Android" control={<Radio />} label="Android (Tactile)" />
                    <FormControlLabel value="Touche" control={<Radio color="error" />} label="Petit téléphone (Touche)" />
                    <FormControlLabel value="iPhone" control={<Radio />} label="iPhone" />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            {/* Q3: OFFRE */}
            <Card elevation={4}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <DollarSign size={20} color="#FFD700" />
                  <Typography variant="h6" fontSize={16} fontWeight="bold">Q3. ABO 200F</Typography>
                </Stack>
                <FormControl component="fieldset">
                  <RadioGroup name="q3_abo" value={formData.q3_abo} onChange={handleChange}>
                    <FormControlLabel value="Oui" control={<Radio />} label="Oui, direct" />
                    <FormControlLabel value="A voir" control={<Radio />} label="Je dois voir pour croire" />
                    <FormControlLabel value="Non" control={<Radio color="error" />} label="Non, trop cher" />
                  </RadioGroup>
                </FormControl>
              </CardContent>
            </Card>

            {/* Q4 & Q6 & Q7 RAPIDES */}
            <Card elevation={4}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">DÉTAILS TECHNIQUES</Typography>
                <Stack spacing={2} mt={1}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Q4. Paiement Préféré</InputLabel>
                    <Select name="q4_paiement" value={formData.q4_paiement} label="Q4. Paiement Préféré" onChange={handleChange} required>
                      <MenuItem value="Wave">Wave</MenuItem>
                      <MenuItem value="Cash">Espèces</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Q6. Connexion Data</InputLabel>
                    <Select name="q6_data" value={formData.q6_data} label="Q6. Connexion Data" onChange={handleChange} required>
                      <MenuItem value="H24">Allumée H24</MenuItem>
                      <MenuItem value="Eco">Je coupe pour économiser</MenuItem>
                      <MenuItem value="Galere">C'est compliqué (Unités)</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel>Q7. Navigation</InputLabel>
                    <Select name="q7_nav" value={formData.q7_nav} label="Q7. Navigation" onChange={handleChange} required>
                      <MenuItem value="GPS">Carte GPS</MenuItem>
                      <MenuItem value="Vocal">Note Vocale</MenuItem>
                      <MenuItem value="Nul">Sait pas lire la carte</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </Card>

            {/* INFOS PERSO */}
            <Box sx={{ border: '1px solid #FFD700', borderRadius: 4, p: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h6" color="primary" gutterBottom textTransform="uppercase" fontWeight="bold">
                Infos Chauffeur
              </Typography>
              <TextField fullWidth label="Nom du Chauffeur" name="nom" variant="filled" value={formData.nom} onChange={handleChange} required />
              <TextField fullWidth label="Numéro WhatsApp" name="telephone" type="tel" variant="filled" value={formData.telephone} onChange={handleChange} required />
            </Box>

            {/* BOUTON ACTION */}
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth startIcon={<CheckCircle />}>
              ENREGISTRER
            </Button>

          </Stack>
        </form>

        {/* FOOTER ADMIN */}
        <Box mt={6} pt={2} borderTop="1px solid #333" display="flex" justifyContent="center" gap={2}>
          <Button variant="outlined" color="inherit" startIcon={<Download />} onClick={handleExport}>
            CSV
          </Button>
          <Button variant="text" color="error" startIcon={<Trash2 />} onClick={handleReset}>
            Reset
          </Button>
        </Box>

        <Snackbar open={openSnack} autoHideDuration={3000} onClose={() => setOpenSnack(false)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
            Chauffeur enregistré avec succès !
          </Alert>
        </Snackbar>

      </Container>
    </ThemeProvider>
  );
}

export default App;