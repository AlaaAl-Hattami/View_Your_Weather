import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import "moment/min/locales";
import { MdLanguage } from "react-icons/md";

moment.locale('ar'); // إعداد اللغة العربية كافتراضية

let CancelAxios = null;

const cities = {
  صنعاء: { lat: 15.369445, lon: 44.191006 },
  عدن: { lat: 12.7852, lon: 45.0189 },
  تعز: { lat: 13.5795, lon: 44.0191 },
  الحديدة: { lat: 14.7978, lon: 42.9538 },
  حضرموت: { lat: 15.9645, lon: 48.2678 },
  إب: { lat: 13.9666, lon: 44.1839 },
  ذمار: { lat: 14.5553, lon: 44.405 },
  مأرب: { lat: 15.4629, lon: 45.322 },
  شبوة: { lat: 14.6586, lon: 46.811 },
  الجوف: { lat: 15.6104, lon: 45.329 },
  صعدة: { lat: 16.9403, lon: 43.7636 },
  لحج: { lat: 13.0582, lon: 44.883 },
  الضالع: { lat: 13.695, lon: 44.725 },
  البيضاء: { lat: 13.9765, lon: 45.573 },
  المهرة: { lat: 16.5074, lon: 52.172 },
  سقطرى: { lat: 12.6318, lon: 53.905 },
  عمران: { lat: 15.6594, lon: 43.9438 },
  ريمة: { lat: 14.6125, lon: 43.379 },
  المحويت: { lat: 15.4795, lon: 43.5447 },
  حجة: { lat: 15.6912, lon: 43.6035 },
  أبين: { lat: 13.2181, lon: 45.518 },
};

const cityTranslations = {
  "صنعاء": "Sana'a",
  "عدن": "Aden",
  "تعز": "Taiz",
  "الحديدة": "Al Hudaydah",
  "حضرموت": "Hadhramaut",
  "إب": "Ibb",
  "ذمار": "Dhamar",
  "مأرب": "Marib",
  "شبوة": "Shabwah",
  "الجوف": "Al Jawf",
  "صعدة": "Sa'dah",
  "لحج": "Lahij",
  "الضالع": "Al Dhale'e",
  "البيضاء": "Al Bayda",
  "المهرة": "Al Mahrah",
  "سقطرى": "Socotra",
  "عمران": "Amran",
  "ريمة": "Raymah",
  "المحويت": "Al Mahwit",
  "حجة": "Hajjah",
  "أبين": "Abyan"
};

const View = () => {
  const { t, i18n } = useTranslation();
  const [dateAndTime, setDateAndTime] = useState('');
  const [temp, setTemp] = useState({
    number: null,
    description: '',
    min: null,
    max: null,
    icons: null,
  });
  const [selectedCity, setSelectedCity] = useState('صنعاء');
  const [translate, setTranslate] = useState('ar');

  function translation() {
    const newLang = translate === 'en' ? 'ar' : 'en';
    setTranslate(newLang);
    i18n.changeLanguage(newLang);
    moment.locale(newLang);
    setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }

  useEffect(() => {
    setDateAndTime(moment().format('MMMM Do YYYY, h:mm:ss a'));
  }, [translate]);

  // جلب بيانات الطقس عند تغيير المدينة
  useEffect(() => {
    const { lat, lon } = cities[selectedCity];

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=9bf988b9134ae21f631e8df0e5a7ce10`,
        {
          cancelToken: new axios.CancelToken((c) => {
            CancelAxios = c;
          }),
        }
      )
      .then((response) => {
        const data = response.data;
        setTemp({
          number: Math.round(data.main.temp - 273.15),
          min: Math.round(data.main.temp_min - 273.15),
          max: Math.round(data.main.temp_max - 273.15),
          description: data.weather[0].description,
          icons: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      if (CancelAxios) CancelAxios();
    };
  }, [selectedCity]);

  // تعديل اسم المدينة بناءً على اللغة المختارة
  const cityName = translate === 'ar' ? selectedCity : cityTranslations[selectedCity];

  return (
    <div className="h-screen bg-gray-900 text-white flex justify-center items-center flex-col">
      <div className="bg-green-600 text-lg p-4 flex flex-col justify-between items-start space-y-4 shadow-lg rounded-lg w-full sm:max-w-lg mx-4" 
      dir={translate == "ar" ? "rtl" :"ltr"}>
      <button className=" text-yellow-400 text-lg font-bold" onClick={translation}>
  {translate === 'en' ? (
    <>
    
      <MdLanguage className="inline-block" />
    Ar  
    </>
  ) : (
    <>
      <MdLanguage className="inline-block mr-2" />
      En
    </>
  )}
</button>


        <div className="flex flex-wrap justify-between items-center w-full">
          <h1 className="font-bold text-4xl sm:text-5xl">{cityName}</h1>
          <p className="mt-5 mr-4 text-sm sm:text-lg">{dateAndTime}</p>
        </div>
        <hr className="border-b border-white w-full" />
        <div className="flex flex-wrap justify-between items-center w-full">
          <div className="flex flex-col space-y-3 w-full sm:w-2/3 text-right sm:text-left">
            <div className="flex items-center">
              <h1 className="text-6xl sm:text-7xl">{temp.number}</h1>
              <img className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" src={temp.icons} alt="" />
            </div>
            <h2 className="mt-3 w-40 text-sm sm:text-lg">{t(temp.description)}</h2>
            <div className="flex justify-start mt-3 space-x-3 rtl:space-x-reverse text-xs sm:text-sm">
              <span>
                {t('min')} : {temp.min}
              </span>
              <span className="text-center">|</span>
              <span>
                {t('max')} : {temp.max}
              </span>
            </div>
          </div>
          <img src={temp.icons} alt="" className="w-20 h-20 sm:w-40 sm:h-40 rounded-tr-full mt-3 sm:mt-0" />
        </div>
      </div>

      

      <div className="w-full  sm:w-96 mt-4 mx-4" dir={translate =='ar' ? "rtl" :'ltr'}>
        <label htmlFor="HeadlineAct" className="block text-lg font-medium text-start text-yellow-500 p-2">
          {t("اختر المدينه")}
        </label>
        <select
          name="HeadlineAct"
          id="HeadlineAct"
          className="w-full rounded-lg border-gray-300 text-gray-700 sm:text-sm p-2"
          style={{
            direction: 'rtl',
            cursor: 'pointer',
          }}
          onChange={(e) => {
            setSelectedCity(e.target.value);
          }}
          value={selectedCity}
        >
          {Object.keys(cities).map((city) => (
            <option className=" font-bold cursor-pointer" key={city} value={city}>
              {translate === 'ar' ? city : cityTranslations[city]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default View;
