import React, { useState, useEffect } from "react";
import { getPermissionsAsync } from "expo-location";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import reactDom from "react-dom";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native"; //스크롤뷰
import { Dimensions } from "react-native"; //치수
import { Fontisto } from '@expo/vector-icons';




const SECREEN_WIDTH = Dimensions.get("window").width;
console.log(SECREEN_WIDTH);
const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";


const icons = {
  "Clouds": "cloudy",
  "Clear" : "day-sunny",
  "Atmosphere" : "cloudy-gusts",
  "Snow" : "snow",
  "Rain" : "rains",
  "Drizzle" : "rain",
  "Thunderstorms" : "lightning",
}


export default function App() {

  //state 3개
  const [city, setCity] = useState("Loading...");
  // const [location, setLocation] = useState(); //이건이제 필요없음
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();

    //step 1 사용자 권한 받기
    if (!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });

    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city); // 내 도시


    //step 2 해당 위치를 API에 전송하고 날씨를 가져와야함
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric `
    );
    const json = await response.json();
    setDays(json.daily);
  };


  useEffect(() => {
    getWeather();
  }, []);





  //컴포넌트가 마운트 되면 useEffect를 사용해서 getPermissions function을호출
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView
        pagingEnabled //
        horizontal
        showsHorizontalScrollIndicator={false} //하단막대
        //indicatorStyle="white" //아이폰만 가능한 인디케이터 색상변경 props
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              style={{ marginTop: 10 }}
              size="large"
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%"}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Fontisto style={styles.icon} name={icons[day.weather[0].main]} size={24} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1,
    // backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 38,
    fontWeight: "700",
  },
  weather: {
    // flex: 3,
    // backgroundColor: "teal",
  },
  day: {
    // flex: 1,
    width: SECREEN_WIDTH,
    alignItems: "center",
    // backgroundColor: "teal",
  },
  temp: {
    color: "white",
    marginTop: 50,
    fontSize: 98,
  },
  description: {
    color: "white",
    marginTop: -10,
    fontSize: 50,
  },
  tinyText: {
    color: "white",
    fontSize: 30,
  },
  icon: {
    fontSize: 50,
  }
});
