import { readFile, writeFile } from "fs/promises";
import fetch from "node-fetch";

export const buildSearchUrl = (city) =>
  encodeURI(
    `https://nominatim.openstreetmap.org/search?city=${city?.name}&namedetails=1&addressdetails=1&countrycodes=dz&format=json`
  );

const buildWilayas = async () => {
  const wilayas_data = JSON.parse(await readFile("cities.json", "utf-8"));

  writeFile(
    "wilayas.json",
    JSON.stringify(
      wilayas_data.map((x) => ({
        id: x.id,
        code: x.code,
        name_ar: x.name_ar,
        name: x.name,
      }))
    )
  );
};

const main = async () => {
  const wilayas_data = JSON.parse(await readFile("cities.json", "utf-8"));

  const cities = wilayas_data
    .map((wilaya) =>
      wilaya.dairas.map((daira) =>
        daira?.communes?.map((commune) => ({
          wilaya_id: wilaya.id,
          daira_id: daira.id,
          ...commune,
        }))
      )
    )
    .flat(2);

  const cities_missed = [];
  const cities_conflicts = [];

  for (const [idx, city] of cities.entries()) {
    if (!city) continue;
    const city_name = city?.name;
    const state_name = wilayas_data[city?.wilaya_id - 1].name;

    let data = await fetch(buildSearchUrl(city), {
      headers: { "accept-language": "en" },
    });

    data = await data.json();

    data = data.filter((x) => x.type === "administrative");
    // console.log({ city_name, state_name, data });

    if (!data.length) cities_missed.push({ ...city, state_name, index: idx });

    if (data.length === 1)
      cities.splice(idx, 1, {
        ...city,
        longitude: data[0].lon,
        latitude: data[0].lat,
      });

    if (data.length > 1)
      cities_conflicts.push({ ...city, state_name, index: idx, data });

    console.log(
      `${idx + 1}/${cities.length} [${
        !data.length ? "MISSED" : data.length > 1 ? "CONFLICT" : "FOUND"
      }] => ${city_name},${state_name} `
    );
  }

  writeFile("cities_proceced.json", JSON.stringify(cities));
  writeFile("cities_missed.json", JSON.stringify(cities_missed));
  writeFile("cities_conflict.json", JSON.stringify(cities_conflicts));

  const found_count =
    cities.length - cities_missed.length - cities_conflicts.length;
  console.log(`Found => ${found_count}/${cities.length}`);
  console.log(`MISSED => ${cities_missed.length}/${cities.length}`);
  console.log(`CONFLICT => ${cities_conflicts.length}/${cities.length}`);
};

// main();
buildWilayas();
