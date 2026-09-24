export const maps = [
    {
        id: 0,
        image: "Valencia.jpg", 
        coordinates: {
            topleft: {
                lat: 39.517613664693144,
                lng: -0.4889598892509934
            },
            bottomright: {
                lat: 39.41638957400675,
                lng: -0.2798250336621361
            }
        },
        submaps: [1,4]
    },
    {
        id: 1,
        image: "Valencia-OldTown.jpg", 
        coordinates: {
            topleft: {
                lat: 39.483261068597244,
                lng: -0.3892695502956495
                
            },
            bottomright: {
                lat: 39.46374828519189,
                lng: -0.3625953669880743
            }
        },
        submaps: [2, 4]
    },
    {
        id: 2,
        parentId: 1,
        image: "OldTown-North2.jpg",
        coordinates: {
            topleft: {
                lat: 39.481,
                lng: -0.38885
            },
            bottomright: {
                lat: 39.4716,
                lng: -0.3643
            }
        },
    },
    {
        id: 4,
        parentId: 0,
        image: "PortSaplaya2.jpg",
        coordinates: {
            topleft: {
                lat: 39.51311305247718,
                lng: -0.3248997739146299
               
            },
            bottomright: {
                lat: 39.507722575720514,
                lng: -0.3178213152412749
            }
        },
    },
    {
        id: 5,
        parentId: 1,
        image: "OldTown-South.jpg",
        coordinates: {
            topleft: {
                lat: 39.473,
                lng: -0.38885
            },
            bottomright: {
                lat: 39.464,
                lng: -0.3643
            }
        },
    }
]