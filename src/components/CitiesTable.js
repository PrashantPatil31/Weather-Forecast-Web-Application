import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../loader/loader";
import Select from "react-select";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CitiesTable = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timezoneFilter, setTimezoneFilter] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=1000"
        );
        setCities(response.data.records);
        setFilteredCities(response.data.records);
        setLoading(false);
        toast.success("Cities data loaded successfully.");
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error("Failed to fetch cities data. Please try again later.");
      }
    };
    fetchCities();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);
    const filtered = cities.filter(
      (city) =>
        city.fields.name.toLowerCase().includes(searchTerm) &&
        (timezoneFilter === null ||
          city.fields.timezone === timezoneFilter.value)
    );
    setFilteredCities(filtered);
  };

  const handleCityClick = (cityName) => {
    navigate(`/weather/${cityName}`);
  };

  const handleTimezoneChange = (option) => {
    setTimezoneFilter(option);
    const filtered = cities.filter(
      (city) =>
        (option === null || city.fields.timezone === option.value) &&
        (!search || city.fields.name.toLowerCase().includes(search))
    );
    setFilteredCities(filtered);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedCities = filteredCities.sort((a, b) => {
    const aValue = a.fields[sortColumn];
    const bValue = b.fields[sortColumn];

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const timezoneOptions = [
    ...new Set(cities.map((city) => city.fields.timezone)),
  ].map((timezone) => ({ value: timezone, label: timezone }));

  if (loading) {
    return <Loader />;
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      height: "3rem",
      padding: "0 1rem",
      borderRadius: "9999px",
      borderColor: state.isFocused ? "#36454F" : "#36454F",
      boxShadow: state.isFocused
        ? "0 0 0 1px #3498db"
        : "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      backgroundColor: state.isDisabled ? "#e5e7eb" : "#e5e7eb",
      "&:hover": {
        borderColor: state.isFocused ? "#3498db" : "#d9d9d9",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3498db"
        : state.isFocused
        ? "#f0f0f0"
        : null,
      color: state.isSelected ? "#fff" : state.isFocused ? "#333" : "#333",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#333",
    }),
    menuList: (provided, state) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
    }),
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <ToastContainer />
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="w-full md:w-2/3 md:mr-4 mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                className="w-full border h-12 shadow p-4 rounded-full dark:text-gray-800 dark:border-gray-700 dark:bg-gray-200"
                placeholder="Search City"
                onChange={handleSearch}
              />
              <button type="submit">
                <svg
                  className="text-teal-400 h-5 w-5 absolute top-3.5 right-3 fill-current dark:text-teal-300"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  version="1.1"
                  viewBox="0 0 56.966 56.966"
                  style={{ enableBackground: "new 0 0 56.966 56.966" }}
                  xmlSpace="preserve"
                >
                  <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23 s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92 c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17 s-17-7.626-17-17S14.61,6,23.984,6z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <Select
              options={timezoneOptions}
              value={timezoneFilter}
              onChange={handleTimezoneChange}
              placeholder="Filter by Timezone"
              isClearable
              styles={customStyles}
            />
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-1xl uppercase text-black ">
            <tr className="bg-gray-200 ">
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer relative"
                onClick={() => handleSort("name")}
              >
                City
                {sortColumn === "name" && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {sortDirection === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer relative"
                onClick={() => handleSort("cou_name_en")}
              >
                Country
                {sortColumn === "cou_name_en" && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {sortDirection === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </span>
                )}
              </th>
              <th
                scope="col"
                className="px-6 py-3 cursor-pointer relative"
                onClick={() => handleSort("timezone")}
              >
                Timezone
                {sortColumn === "timezone" && (
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    {sortDirection === "asc" ? (
                      <IoIosArrowUp />
                    ) : (
                      <IoIosArrowDown />
                    )}
                  </span>
                )}
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedCities.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-900">
                  Data is not found.
                </td>
              </tr>
            ) : (
              sortedCities.map((city) => (
                <tr
                  key={city.recordid}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
                  onClick={() => handleCityClick(city.fields.name)}
                >
                  <td className="border px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {city.fields.name}
                  </td>
                  <td className="border px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {city.fields.cou_name_en}
                  </td>
                  <td className="border px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {city.fields.timezone}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CitiesTable;
