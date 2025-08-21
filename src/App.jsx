import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
// import 'moment/min/locales'; // Import Arabic locale for moment.js
import "moment/dist/locale/ar"; // Import Arabic locale for moment.js
moment.locale("en");

const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
})

let cancelAxios = null;

function App() {

  const { t, i18n } = useTranslation();

  const [dateAndTime, setDateAndTime] = useState("");
  const locations = ['Cairo', 'Alexandria', 'Istanbul', 'London', 'Tokyo', 'New York', 'Berlin', 'Paris', 'Dubai', 'Rome'];
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
    name: "",
  });
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState('en');

  function handleLanguageClick() {
    if (locale === 'en') {
      setLocale('ar');
      moment.locale('ar_SA');
      i18n.changeLanguage('ar');
    } else {
      setLocale('en');
      moment.locale('en');
      i18n.changeLanguage('en');
    }
    setDateAndTime(moment().format('Do MMMM YYYY, h:mm a'));
  }

  useEffect(() => {
    i18n.changeLanguage(locale); // Set the language to Arabic
  }, [])

  useEffect(() => {

    setDateAndTime(moment().format('Do MMMM YYYY, h:mm a'));
    setLoading(true);
    setTemp({ number: null, description: '', min: null, max: null, icon: null, name: '' });
    // axios.get('https://api.openweathermap.org/data/2.5/weather?q=London,GB&appid=a65feaa3d99a51815c18e872006eac2d') // Example for London
    // axios.get(
    //   "https://api.openweathermap.org/data/2.5/weather",
    //   {
    //     params: {
    //       lat: 30.033333,
    //       lon: 31.233334,
    //       appid: "a65feaa3d99a51815c18e872006eac2d",
    //     }, // Using latitude and longitude for Cairo
    //   }) // Example for Cairo
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${selectedLocation}&appid=a65feaa3d99a51815c18e872006eac2d`,
      {
        cancelToken: new axios.CancelToken((c) => {
          cancelAxios = c;
        })
      }
    ) // Example for Cairo
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 272.15); // Convert Kelvin to Celsius
        const min = (response.data.main.temp_min - 272.15).toFixed(2); // Convert Kelvin to Celsius and round to 2 decimal places
        const max = (response.data.main.temp_max - 272.15).toFixed(2);
        const description = response.data.weather[0].description;
        const icon = response.data.weather[0].icon;
        const name = response.data.name;

        setTemp({ number: responseTemp, min: min, max: max, description: description, icon: `https://openweathermap.org/img/wn/${icon}@2x.png`, name: name });
        // setTemp({number: responseTemp, min, max, description});
        setLoading(false);
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        setLoading(false);
        setTemp({ number: null, description: 'Error loading data', min: null, max: null, icon: null, name: '' });
        console.log(error);
      });

    return () => {
      console.log('Cleanup function called');
      cancelAxios();
    };
  }, [selectedLocation]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <div style={{ maxHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
          <Typography variant="h2" style={{ margin: '10px 0 10px 0', color: '#3683d4ff', fontWeight: 800, letterSpacing: 1, textAlign: 'center' }}>
            {t("Weather App")}
          </Typography>
          <Typography variant="p" style={{ marginBottom: '16px', color: '#3683d4ff', textAlign: 'center' }}>
            {t("Choose a location : ")}
          </Typography>
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <>
                <Button variant="contained" {...bindTrigger(popupState)} style={{ marginBottom: '32px', outline: 'none', background: '#ffffff', color: '#3683d4ff', padding: '12px 34px' }}>
                  {t(selectedLocation)}
                </Button>
                <Menu
                  {...bindMenu(popupState)}
                  MenuListProps={{ style: { maxHeight: 250, overflowY: 'auto' } }}
                >
                  {locations.map((location) =>
                    <MenuItem
                      style={{ color: '#3683d4ff' }}
                      key={location}
                      onClick={() => {
                        setSelectedLocation(location);
                        popupState.close();
                      }}
                    >
                      {t(location)}
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </PopupState>
          <Container maxWidth="sm" >
            {/* Content Container */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              {/* Card */}
              <div dir={locale == "ar" ? "rtl" : "ltr"} style={{ background: '#3683d4ff', color: '#ffffff', padding: '20px', borderRadius: '16px', boxShadow: '0px 8px 1px rgba(0,0,0,0.05)', width: '100%' }}>
                {/* Content */}
                <div >
                  {/* City & Time */}
                  <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'start' }}>
                    <Typography variant="h2" style={{ color: '#ffffff', marginLeft: '20px' }}>
                      {temp.name ? t(temp.name) : 'Loading...'}
                      {/* {t('weather.in')} */}
                    </Typography>
                    <Typography variant="h4" style={{ color: '#ffffff', marginLeft: '20px' }}>
                      {loading ? 'Loading...' : dateAndTime}
                    </Typography>
                  </div>

                  <hr />

                  {/* Container of Degree & Cloud icon */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                    {/* Degree & Discription */}
                    <div>
                      {/* Temprature */}
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h2" component="h1" style={{}}>
                          {temp.number !== null ? `${temp.number}°C` : 'Loading...'}
                        </Typography>

                        <img src={temp.icon} alt={temp.description} />
                      </div>

                      <Typography variant="h6" component="h5" style={{}}>
                        {locale === 'en' ? temp.description.charAt(0).toUpperCase() + temp.description.slice(1) : t(temp.description)}
                        {/* {temp.description ? t(temp.description).charAt(0).toUpperCase() + temp.description.slice(1) : 'Loading...'} */}
                      </Typography>

                      {/* Min & Max */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', alignItems: 'center' }}>
                        <h4>{t("Min")} : {temp.min}°C</h4>
                        <h4 style={{ margin: '0px 8px' }}>|</h4>
                        <h4>{t("Max")} : {temp.max}°C</h4>
                      </div>
                    </div>

                    {/* Icon */}
                    <CloudIcon style={{ fontSize: '200px', color: 'ffffff' }} />
                  </div>
                </div>
              </div>
              {/* Card */}

              {/* Translation Container */}
              <div dir={locale == "ar" ? "rtl" : "ltr"} style={{ display: 'flex', justifyContent: 'end', width: '100%', marginTop: '20px' }}>
                <Button variant="text" style={{ background: '#ffffff', outline: 'none' }} onClick={handleLanguageClick}>
                  {locale === 'en' ? 'Arabic' : 'إنجليزي'}
                </Button>
              </div>
            </div>
          </Container>
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
