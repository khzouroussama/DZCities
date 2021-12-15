import { readFile, writeFile } from "fs/promises";

export const removeSameStateConflict = async () => {
  let conflict_list = JSON.parse(
    await readFile("cities_conflict.json", "utf-8")
  );

  let cities = JSON.parse(await readFile("cities_proceced.json", "utf-8"));

  conflict_list.forEach((city) =>
    cities.splice(city.index, 1, {
      ...cities[city.index],
      longitude: city.data[0].lon,
      latitude: city.data[0].lat,
    })
  );

  conflict_list = conflict_list.filter((x) => x.data.length !== 1);
  writeFile("cities_proceced.json", JSON.stringify(cities));
  writeFile("cities_conflict.json", JSON.stringify(conflict_list));
};

export const fillMissing = async () => {
  let cities_missed = JSON.parse(await readFile("cities_missed.json", "utf-8"));

  let cities = JSON.parse(await readFile("cities_proceced.json", "utf-8"));

  cities_missed.forEach((city) =>
    cities.splice(city.index, 1, {
      ...cities[city.index],
      longitude: city.longitude,
      latitude: city.latitude,
    })
  );

  writeFile("cities_proceced.json", JSON.stringify(cities));
};

// removeSameStateConflict();
fillMissing();
