export const getDashboard = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          stats: [
            {
              id: 1,
              title: "Total Bookings",
              value: 25,
              change: "+5%",
            },
            {
              id: 2,
              title: "Total Users",
              value: 18,
              change: "+2%",
            },
            {
              id: 3,
              title: "Total Services",
              value: 8,
              change: "+1%",
            },
          ],
          schedule: [],
        },
      });
    }, 1000);
  });
};