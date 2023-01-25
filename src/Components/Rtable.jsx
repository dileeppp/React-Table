import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useExpanded, usePagination, useTable } from "react-table";
import "./Rtable.css";
import ClipLoader from "react-spinners/ClipLoader";

const Rtable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const getData = async (URL) => {
    try {
      setLoading(true);
      const res = await axios.get(URL);
      setData(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData("https://jsonplaceholder.typicode.com/users");
  }, []);

  const COLUMNS = [
    {
      id: "ID",
      accessor: "username",
      Cell: ({ value }) => {
        return <div>Hello {value}</div>;
      },
    },
    {
      id: "CONTACT",
      accessor: "name",
      Cell: ({ value }) => {
        return (
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
          >
            <div style={{ fontStyle: "normal", fontWeight: "bolder" }}>
              Contact
            </div>
            <div>{value}</div>
          </div>
        );
      },
    },
    {
      id: "STREET",
      accessor: "street",
      Cell: ({ value }) => {
        return (
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
          >
            <div style={{ fontStyle: "normal", fontWeight: "bolder" }}>
              Street
            </div>
            <div>{value}</div>
          </div>
        );
      },
    },
    {
      id: "CITY",
      accessor: "city",
      Cell: ({ value }) => {
        return (
          <div
            style={{ display: "flex", flexDirection: "column", rowGap: "10px" }}
          >
            <div style={{ fontStyle: "normal", fontWeight: "bolder" }}>
              City
            </div>
            <div>{value}</div>
          </div>
        );
      },
    },
    {
      id: "expander",
      Header: () => null,
      Cell: ({ row }) => (
        <span
          {...row.getToggleRowExpandedProps({
            style: {
              paddingLeft: `${row.depth * 2}rem`,
            },
          })}
        >
          {row.isExpanded ? (
            <button
              style={{
                border: "none",
                background: "red",
                color: "white",
                borderRadius: "20px",
              }}
            >
              Hide Details
            </button>
          ) : (
            <button
              style={{
                border: "none",
                background: "red",
                color: "white",
                borderRadius: "20px",
              }}
            >
              View Details
            </button>
          )}
        </span>
      ),
    },
  ];
  const columns = useMemo(() => COLUMNS, []);

  useEffect(() => {
    const handleData = (data) => {
      setTableData(
        data.map(
          ({
            name,
            username,
            phone,
            email,
            address: { street, city, suite, zipcode },
          }) => ({
            name,
            street,
            city,
            username,
            phone,
            email,
            suite,
            zipcode,
          })
        )
      );
    };
    if (data) {
      handleData(data);
    }
  }, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex, pageSize },
    setPageSize,
    prepareRow,
  } = useTable(
    { columns, data: tableData, initialState: { pageIndex: 0, pageSize: 3 } },
    useExpanded,
    usePagination
  );

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        {loading ? (
          <ClipLoader
            color={"#fff"}
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
          />
        ) : (
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <>
                  <tr
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    })}
                  </tr>
                  <tr>
                    {row.isExpanded ? (
                      <td colSpan={5}>
                        <div>{renderSubComponent(row)}</div>
                      </td>
                    ) : null}
                  </tr>
                </>
              );
            })}
          </tbody>
        )}
      </table>
      <div>
        <span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[3, 5, 7].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                show{pageSize}
              </option>
            ))}
          </select>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          previous
        </button>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          next
        </button>
      </div>
    </div>
  );
};

const renderSubComponent = (row) => {
  const data = row.original;

  const { city, street, name, email, suite, zipcode, phone } = data;

  return (
    <div
      style={{
        height: "450px",
        width: "850px",
        border: "3px solid grey",
        background: "white",
        marginLeft: 200,
        marginRight: 150,
      }}
    >
      <div style={{}}>
        <h5>Description</h5>
        <div style={{ height: "50px", width: "600px", paddingLeft: "150px" }}>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim dolores
          maxime dolor tempore ab blanditiis. Amet id veritatis, doloribus
          officia similique rerum deleniti fuga et architecto cum fugiat ab
          aspernatur.
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ width: "50%" }}>
          <h5>Contact Person</h5>
          <p>{name}</p>
          <h5>Designation</h5>
          <p>Developer</p>
          <h5>Emails</h5>
          <p>{email}</p>
          <h5>Phone</h5>
          <p>{phone}</p>
        </div>
        <div>
          <h5>Address </h5>
          <p>
            {street},{suite},{city},{zipcode}
          </p>
          <h5>City</h5>
          <p>{city}</p>
          <h5>Street</h5>
          <p>{street}</p>
          <h5>Country</h5>
          <p>India</p>
        </div>
      </div>
    </div>
  );
};

export default Rtable;
