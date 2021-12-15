import { readFile, writeFile } from "fs/promises";

export const removeSameStateConflict = async () => {
  let conflict_list = JSON.parse(
    await readFile("cities_conflict.json", "utf-8")
  );

  let cities = JSON.parse(await readFile("cities_proceced.json", "utf-8"));

  const removed_conflict = conflict_list
    .map((city) => ({
      ...city,
      data: city.data.filter(
        (x) => x.address.state.toLowerCase() === city.state_name.toLowerCase()
      ),
    }))
    .filter((x) => x.data.length == 1);

  conflict_list = conflict_list.filter(
    (city) =>
      city.data.filter(
        (x) => x.address.state.toLowerCase() === city.state_name.toLowerCase()
      ).length !== 1
  );

  removed_conflict.forEach((city) =>
    cities.splice(city.index, 1, {
      ...cities[city.index],
      longitude: city.data[0].lon,
      latitude: city.data[0].lat,
    })
  );

  writeFile("cities_proceced.json", JSON.stringify(cities));
  writeFile("cities_conflict.json", JSON.stringify(conflict_list));
};

export const cleanData = async () => {
  const cities = JSON.parse(await readFile("cities_proceced.json", "utf-8"));

  const filterd_cities = cities
    .filter((x) => x)
    .map((city) => ({
      ...city,
      longitude: Number(city.longitude),
      latitude: Number(city.latitude),
    }));

  writeFile("cities_proceced.json", JSON.stringify(filterd_cities));
};

// removeSameStateConflict();
cleanData();
