
let bussinessSchema = {
    name: "MX GLOBALSOLUTIONS",
    person: {
        name: "EFRAIN",
        lastname: "BECERRA",
        lastname2: "CASILLAS",
        email: "efrain.becerra@mxglobalsolutions.com",
        phone: "3112484460",     
    },
    // receptor: [receptorSchema],
    // address: addressSchema, 
    taecel: {
        cash: 3000,
        services: 2000,
    },

    configuration: {
        email: {
            email: "efrain.becerra@mxglobalsolutions.com",
            password: "MXGSefrain1",
            smpt: "smtp.gmail.com",
            port: 587
        },
        billing: {}
    }
}

let branchOffice = {
    name: "SUCURSAL TEPIC", 
    phone: "3112484460", 
    bussiness: ObjectId("59cec381eb7dd4c1dac7ff59"),
    person: {
        name: "EFRAIN",
        lastname: "BECERRA",
        lastname2: "CASILLAS",
        email: "efrain.becerra@mxglobalsolutions.com",
        phone: "3112484460",
        gender: "M",
    }
}

let user = {
    user: "efrain.becerra",
    password: "$2a$04$ZTuUD2HkvTa4RWvr2CfRDuNHrVfdjJAwYo3DRPm4byFBjseYIwCxO",
    email: "efrain.becerra@mxglobalsolutions.com",
    person: {
        name: "EFRAIN",
        lastname: "BECERRA",
        lastname2: "CASILLAS",
        email: "efrain.becerra@mxglobalsolutions.com",
        phone: "3112484460",
        gender: "M",
    },
    bussiness: ObjectId("59cec3a2eb7dd4c1dac7ff5a"),
    branchOffice: ObjectId("59cec1f7eb7dd4c1dac7ff58")
}
