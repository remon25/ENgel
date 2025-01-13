"use client";
import { useEffect, useState } from "react";
import Spinner from "../_components/layout/Spinner";
import withAdminAuth from "../_components/withAdminAuth";
import { useProfile } from "../_components/useProfile";

function DashboardPage() {
  const { loading, status, isAdmin } = useProfile();
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ProductItems, setProductItems] = useState([]);
  const [categories, setCategories] = useState([]);



  useEffect(() => {
    fetch("/api/users").then((response) =>
      response.json().then((users) => {
        setUsers(users);
      })
    );
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchProductItems = async () => {
      
      try {
        const response = await fetch("/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProductItems(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductItems();

    return () => {
      setProductItems([]);
    };
  }, [status]);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) => {
      res.json().then((orders) => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      });
    });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch("/api/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      });
  }

  if (loading || status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden">
        <Spinner />
      </div>
    );
  }
  if (isAdmin === null) return null;
  return (
    <div className="grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 sm:px-8">
      <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
        <div className="p-4 bg-green-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Benutzer</h3>
          <p className="text-3xl">{users.length}</p>
        </div>
      </div>

      <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
        <div className="p-4 bg-blue-400">
          <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
            stroke="#ffffff"
            className="w-12 h-12"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <defs>
                <style>
                  {`.cls-1,.cls-2{fill:none;stroke:#ffffff;stroke-linejoin:round;stroke-width:2px;}.cls-1{stroke-linecap:round;}`}
                </style>
              </defs>
              <g id="cart-add">
                <circle cx="51.0821" cy="8.0978" r="1.0691"></circle>
                <path
                  className="cls-1"
                  d="M59.6548,18H6.3452A1.2486,1.2486,0,0,0,5,19.121V55.6547A1.3453,1.3453,0,0,0,6.3452,57h53.31A1.3453,1.3453,0,0,0,61,55.6547V19.121A1.2486,1.2486,0,0,0,59.6548,18Z"
                ></path>
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="12" cy="21" r="1"></circle>
                <circle cx="15" cy="21" r="1"></circle>
                <line
                  className="cls-1"
                  x1="13.5858"
                  x2="16.4142"
                  y1="6.0858"
                  y2="8.9142"
                ></line>
                <line
                  className="cls-1"
                  x1="16.4142"
                  x2="13.5858"
                  y1="6.0858"
                  y2="8.9142"
                ></line>
                <circle className="cls-1" cx="36" cy="9" r="2"></circle>
                <circle cx="23.0821" cy="13.0978" r="1.0691"></circle>
                <line
                  className="cls-1"
                  x1="24.1629"
                  x2="39.8341"
                  y1="34"
                  y2="34"
                ></line>
                <polyline
                  className="cls-1"
                  points="17 30 23 30 24 34 26 44 43 44 43.974 39.128"
                ></polyline>
                <path
                  className="cls-1"
                  d="M43,47H27.5A1.5,1.5,0,0,1,26,45.5h0A1.5,1.5,0,0,1,27.5,44h4.5728"
                ></path>
                <circle className="cls-1" cx="40.5" cy="49.5" r="1.5"></circle>
                <circle className="cls-1" cx="28.5" cy="49.5" r="1.5"></circle>
                <circle className="cls-1" cx="45" cy="34" r="5"></circle>
                <line className="cls-1" x1="45" x2="45" y1="32" y2="36"></line>
                <line className="cls-1" x1="43" x2="47" y1="34" y2="34"></line>
                <line className="cls-2" x1="5" x2="61" y1="24" y2="24"></line>
              </g>
            </g>
          </svg>
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Bestellungen</h3>
          <p className="text-3xl">{orders.length}</p>
        </div>
      </div>

      <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
        <div className="p-4 bg-indigo-400">
          <svg
            version="1.1"
            id="_x32_"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xmlSpace="preserve"
            className="h-12 w-12 text-white"
          >
            <style type="text/css">{`.st0 { fill: #ffffff; }`}</style>
            <g>
              <path
                className="st0"
                d="M429.193,255.361c-10.338-26.562-27.764-48.818-49.811-65.805c-19.845-15.284-43.403-26.346-69.102-32.786
		v-31.94l41.707-58.393L309.279,0h-5.948h-100.61l-42.708,66.436l41.707,58.386v31.948c-35.221,8.82-66.451,26.346-89.516,51.491
		c-12.464,13.59-22.502,29.398-29.397,47.1c-6.888,17.696-10.632,37.27-10.624,58.293c0.008,24.829,4.599,49.389,12.203,72.33
		c11.432,34.42,29.574,65.189,49.989,87.868c10.223,11.324,21.023,20.661,32.124,27.332c5.554,3.343,11.186,6.017,16.918,7.888
		c5.716,1.864,11.54,2.928,17.364,2.928h110.439c7.782,0,15.515-1.88,23.066-5.061c13.204-5.601,26.03-15.184,38.187-27.594
		c18.196-18.636,34.866-43.749,47.17-72.361c12.279-28.612,20.168-60.736,20.176-93.33
		C439.825,292.631,436.081,273.063,429.193,255.361z M186.344,65.789l28.28-43.987h82.76l28.28,43.987l-31.885,44.643h-75.557
		L186.344,65.789z M288.486,132.225v24.498h-64.972v-24.498H288.486z M406.93,379.128c-10.431,31.508-27.333,60.011-45.49,80.133
		c-9.06,10.053-18.428,18.011-27.163,23.249c-4.368,2.62-8.566,4.576-12.457,5.84c-3.883,1.271-7.442,1.848-10.601,1.848H200.78
		c-4.206,0.008-9.144-1.04-14.591-3.343c-9.522-3.991-20.43-11.833-31.076-22.749c-16.008-16.348-31.462-39.458-42.724-65.727
		c-11.294-26.278-18.42-55.69-18.412-84.726c0-18.458,3.259-35.259,9.144-50.389c8.836-22.664,23.627-41.654,42.809-56.452
		c16.64-12.835,36.623-22.449,58.702-28.288h102.667c30.591,8.081,57.114,23.388,76.428,44.473
		c10.723,11.694,19.259,25.152,25.152,40.274c5.894,15.122,9.144,31.924,9.144,50.382
		C418.023,335.779,413.894,358.112,406.93,379.128z"
              />
              <rect
                x="180.804"
                y="272.247"
                className="st0"
                width="150.391"
                height="117.696"
              />
            </g>
          </svg>
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Produkte</h3>
          <p className="text-3xl">{ProductItems.length}</p>
        </div>
      </div>

      <div className="flex items-center bg-white border rounded-sm overflow-hidden shadow">
        <div className="p-4 bg-red-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-white"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M5 10H7C9 10 10 9 10 7V5C10 3 9 2 7 2H5C3 2 2 3 2 5V7C2 9 3 10 5 10Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M17 10H19C21 10 22 9 22 7V5C22 3 21 2 19 2H17C15 2 14 3 14 5V7C14 9 15 10 17 10Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M17 22H19C21 22 22 21 22 19V17C22 15 21 14 19 14H17C15 14 14 15 14 17V19C14 21 15 22 17 22Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M5 22H7C9 22 10 21 10 19V17C10 15 9 14 7 14H5C3 14 2 15 2 17V19C2 21 3 22 5 22Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </g>
          </svg>
        </div>
        <div className="px-4 text-gray-700">
          <h3 className="text-sm tracking-wider">Kategorien</h3>
          <p className="text-3xl">{categories.length}</p>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(DashboardPage);
