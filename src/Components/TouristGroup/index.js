import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";
import LinearProgress from "@material-ui/core/LinearProgress";
import SnackBarC from "../SnackBarC";
import MaterialTable from "material-table";
import TableIcons from "../utilities/TableIcons";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { useRecoilState } from "recoil";
import Select from "@material-ui/core/Select";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import MenuItem from "@material-ui/core/MenuItem";
import { darkModeState } from "../../containers/state";
import CostDetails from "./CostDetails";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CustomerDetails from "./CustomerDetails";
import StaffDetails from "./StaffDetails";
import CustomDialog from "./CustomDialog";
import Button from "@material-ui/core/Button";

async function Delete(id) {
  fetch("http://localhost:5000/api/touristGroup/deletetouristGroup/" + id, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
}

async function Edit(id, touristGroup) {
  fetch("http://localhost:5000/api/touristGroup/UpdateTouristGroup/" + id, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(touristGroup),
  });
}

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 630,
  },
  header: {
    fontWeight: 900,
  },
  detailTable: {
    padding: theme.spacing(4),
    margin: theme.spacing(4),
  },
  fab: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed",
  },
}));

function TouristGroupsTable(props) {
  const [data, setData] = useState([]);
  const [dialogDetails, setDialogDetails] = useState("");
  const classes = useStyles();
  const [isLoad, setIsLoad] = useState(false);
  const [touristGroups, settouristGroups] = useState([]);
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [isDarkMode] = useRecoilState(darkModeState);
  const [tour, setTour] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const updateCustomerList = (touristGroupId, customerList) => {
    settouristGroups(
      touristGroups.map((s) => {
        if (s.touristGroupId === touristGroupId)
          s.touristGroupDetailsOfCustomerList = customerList;
        return s;
      })
    );
  };
  const updateCostDetailsList = (touristGroupId, costDetailsList) => {
    settouristGroups(
      touristGroups.map((s) => {
        if (s.touristGroupId === touristGroupId)
          s.costDetailsList = costDetailsList;
        return s;
      })
    );
  };
  const updateStaffList = (touristGroupId, staffList) => {
    settouristGroups(
      touristGroups.map((s) => {
        if (s.touristGroupId === touristGroupId)
          s.touristGroupDetailsOfStaffList = staffList;
        return s;
      })
    );
  };

  async function Add(touristGroup) {
    await fetch("http://localhost:5000/api/touristGroup/CreatetouristGroup/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(touristGroup),
    });
    fetchData();
  }

  const handleSnackBarOnClose =
    (() => {
      setIsSnackBarOpen(false);
    },
    [false]);

  useEffect(() => {
    fetchData().then(() => {});
    fetchTourData();
  }, []);

  useEffect(() => {}, [touristGroups]);

  async function fetchData() {
    setIsLoad(false);
    const result = await axios(
      "http://localhost:5000/api/touristGroup/getalltouristGroup"
    );
    setIsLoad(true);
    settouristGroups(result.data);
  }

  async function fetchTourData() {
    const result = await axios("http://localhost:5000/api/tour/getalltour");
    return setTour(result.data);
  }
  const checkStartDate = (tourData) => {
    const date = tourData.startDate;
    var isValidate = false;
    var tourPriceList = [];
    if (tourData.tour !== undefined) {
      tourPriceList = tourData.tour.tourPriceList;
    } else {
      if (tourData.tourId !== undefined) {
        tour.forEach((t) => {
          if (t.tourId === tourData.tourId) {
            tourPriceList = t.tourPriceList;
            console.log(tourPriceList);
          }
        });
      } else {
        return false;
      }
    }

    let formatedDate = new Date(date);
    formatedDate.setHours(1, 1, 1, 1);
    tourPriceList.forEach((c) => {
      let startDate = new Date(c.startDate);
      startDate.setHours(0, 0, 0, 0);
      let endDate = new Date(c.endDate);
      endDate.setHours(23, 23, 23, 23);
      if (formatedDate <= endDate && formatedDate >= startDate) {
        isValidate = true;
      }
    });

    return isValidate;
  };

  function getTourName(tourId) {
    let name;
    tour.forEach((ele) => {
      if (ele.tourId === tourId) {
        name = ele.tourName;
      }
    });
    return name;
  }
  const tourOptions = tour.map((t) => ({
    key: t.tourId,
    text: t.tourName,
    value: t.tourId,
  }));
  const onOpenDialog = (rowData) => {
    setOpenDialog(true);
    setDialogDetails(rowData.scheduleDetails);
  };
  return (
    <div>
      {!isLoad ? (
        <LinearProgress color={isDarkMode ? "primary" : "secondary"} />
      ) : (
        <React.Fragment> </React.Fragment>
      )}
      <CustomDialog
        title="Details"
        details={dialogDetails}
        openDialog={openDialog}
        onCloseDialog={() => setOpenDialog(false)}
      />
      <MaterialTable
        title="Tourist Group"
        icons={TableIcons}
        //data=touristGroups.map((d) => ({ ...d }))
        data={touristGroups}
        options={{
          actionsColumnIndex: -1,
        }}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                Add(newData);
                resolve();
              }, 100);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                const dataUpdate = [...touristGroups];
                const index = oldData.tableData.id;
                dataUpdate[index] = newData;
                const Sender = {
                  touristGroupId: newData.touristGroupId,
                  groupName: newData.groupName,
                  numberOfMembers: newData.numberOfMembers,
                  startDate: newData.startDate,
                  endDate: newData.endDate,
                  scheduleDetails: newData.scheduleDetails,
                  tourId: newData.tourId,
                };
                settouristGroups([...dataUpdate]);

                Edit(oldData.touristGroupId, Sender);
                resolve();
              }, 100);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                Delete(oldData.touristGroupId);

                settouristGroups(
                  touristGroups.filter(
                    (item) => item.touristGroupId !== oldData.touristGroupId
                  )
                );
                resolve();
              }, 1000);
            }),
        }}
        detailPanel={[
          {
            icon: MonetizationOnIcon,
            tooltip: "Cost details",
            render: (rowData) => {
              return (
                <div>
                  <CostDetails
                    groupId={rowData.touristGroupId}
                    groupName={rowData.groupName}
                    onUpdate={updateCostDetailsList}
                    setIsLoad={setIsLoad}
                  />
                </div>
              );
            },
          },
          {
            icon: AccountCircleIcon,
            tooltip: "Customers",
            render: (rowData) => {
              return (
                <CustomerDetails
                  //className={classes.detailTable}
                  title="Customer List"
                  customerList={rowData.touristGroupDetailsOfCustomerList}
                  touristGroupId={rowData.touristGroupId}
                  fetchTouristGroup={fetchData}
                  onUpdate={updateCustomerList}
                />
              );
            },
          },
          {
            icon: AssignmentIndIcon,
            tooltip: "Staff",
            render: (rowData) => {
              return (
                <StaffDetails
                  //className={classes.detailTable}
                  title="Staff List"
                  staffList={rowData.touristGroupDetailsOfStaffList}
                  touristGroupId={rowData.touristGroupId}
                  fetchTouristGroup={fetchData}
                  onUpdate={updateStaffList}
                />
              );
            },
          },
        ]}
        columns={[
          {
            title: "Group Name",
            field: "groupName",
            validate: (rowData) =>
              rowData.groupName < 1 ? "Name must not be empty" : true,
          },
          {
            title: "Tour Name",
            field: "tourId",
            type: "numeric",
            editComponent: (t) => (
              <Select
                value={t.value ? t.value : 0}
                onChange={(e) => {
                  t.onChange(e.target.value);
                  console.log(e.target.value);
                }}
              >
                {tour.map((each) => (
                  <MenuItem value={each.tourId}>{each.tourName}</MenuItem>
                ))}
              </Select>
            ),
            render: (rowData) => {
              return getTourName(rowData.tourId);
            },
          },
          {
            title: "Start Date",
            field: "startDate",
            type: "date",
            initialEditValue: new Date().toISOString(),
            validate: (rowData) =>
              checkStartDate(rowData)
                ? true
                : "Price is not set for this start date",
            render: (rowData) => new Date(rowData.startDate).toDateString(),
          },
          {
            title: "End date",
            field: "endDate",
            type: "date",
            initialEditValue: new Date().toISOString(),
            render: (rowData) => new Date(rowData.endDate).toDateString(),
            validate: (rowData) =>
              new Date(rowData.endDate) < new Date(rowData.startDate)
                ? "Start date must be after end date!"
                : true,
          },
          {
            title: "Schedule Details",
            field: "scheduleDetails",

            editComponent: (t) => (
              <TextareaAutosize
                aria-label="minimum height"
                onChange={(e) => t.onChange(e.target.value)}
                rowsMin={3}
                value={t.value}
              />
            ),
            render: (rowData) => (
              <div>
                <Button
                  variant="outlined"
                  size="small"
                  color="inherit"
                  onClick={() => onOpenDialog(rowData)}
                >
                  Details
                </Button>
              </div>
            ),
          },
        ]}
        localization={{
          header: {
            actions: "",
          },
        }}
      />
    </div>
  );
}
export default TouristGroupsTable;
