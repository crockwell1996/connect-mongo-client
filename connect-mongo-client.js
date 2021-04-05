const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';

MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if (err) {
        return console.log(err);
    }
    // Specify database you want to access
    const db = client.db('RestaurantMenus');

    console.log(`MongoDB Connected: ${url}`);
    // Instantiate/get chilisMenu collection and declare menu name array
    const chilisMenu = db.collection('ChilisMenu');
    const chilisMenus = ['Chilis To-Go Menu'];
    // For each chili's menu type, insert a document if none found
    chilisMenus.forEach((menu) => {
        chilisMenu.findOne({name: menu}, (err, res) => {
            if (err) {
                return console.log(err);
            } else if (!res) {
                chilisMenu.insertOne({name: menu}, (err, res) =>{
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`Inserted: ${menu} into chilisMenu`);
                });
            } else {
                console.log(`Menu: ${menu} found in chilisMenus\n`);
            }
        });
    });
    // Instantiate/get chilisMenuGroup collection and declare menu group name array
    const chilisMenuGroup = db.collection('ChilisMenuGroup');
    const menuGroups = ['Appetizers', 'Soup, Chili, and Sides'];
    // For each chili's menu type, insert a document if none found
    menuGroups.forEach((group) => {
        chilisMenuGroup.findOne({name: group}, (err, res) => {
            if (err) {
                return console.log(err);
            } else if (!res) {
                chilisMenu.findOne({name: 'Chilis To-Go Menu'}, (findMenuErr, findMenuRes) => {
                    if (findMenuErr) {
                        return console.log(findMenuErr);
                    } else {
                        chilisMenuGroup.insertOne({name: group, menu: findMenuRes._id}, (err, res) =>{
                            if (err) {
                                return console.log(err);
                            }
                            console.log(`Inserted: ${group} into ChilisMenuGroup`);
                        });
                    }
                });
            } else {
                console.log(`Menu group: ${group} found in ChilisMenuGroup`);
            }
        });
    });

    const chilisMenuItems = db.collection('ChilisMenuItems');
    const menuItems = [
        {
            name: 'Triple Dipper™',
            description: 'Combine your 3 favorite appetizers!\n' +
                'Served with dipping sauces.\n' +
                '• Big Mouth® Bites\n' +
                '• Boneless Buffalo Wings\n' +
                '• Boneless Honey-Chipotle Wings\n' +
                '• Southwestern Eggrolls\n' +
                '• Original Chicken Crispers®\n' +
                '• Loaded Potato Skins\n' +
                '• Hot Spinach & Artichoke Dip',
            menuGroup: 'Appetizers',
        },
        {
            name: 'California Grilled Chicken Flatbread',
            description: 'Topped with grilled chicken, applewood smoked bacon, tomato sauce, Monterey Jack, mozzarella, chopped cilantro, house-made pico de gallo, fresh sliced avocado & a drizzle of roasted garlic aioli.',
            menuGroup: 'Appetizers',
        },
        {
            name: 'Southwest Chicken Soup',
            description: 'Oven-roasted chicken, hominy & tomato in a flavorful ancho-chile chicken broth. Topped with crispy tortilla strips & chopped cilantro.',
            menuGroup: 'Soup, Chili, and Sides',
        },
        {
            name: 'Chicken Enchilada Soup',
            description: 'Topped with crispy tortilla strips & 3-cheese blend.',
            menuGroup: 'Soup, Chili, and Sides',
        },
    ];
    chilisMenu.findOne({name: 'Chilis To-Go Menu'}, (menuErr, menuRes) => {
        if (menuErr) {
            console.log(menuErr);
        } else {
            console.log(`Inspecting menu collection: 'Chilis To-Go Menu'\n`);
            chilisMenuGroup.find().toArray((menuGroupErr, menuGroupRes) => {
                if (menuGroupErr) {
                    console.log(menuGroupErr);
                } else {
                    menuGroupRes.forEach((group) => {
                        console.log(`Inspecting menu group collection: ${group.name}`);
                        menuItems.forEach((item) => {
                            chilisMenuItems.findOne({name: item.name}, (itemErr, itemRes) => {
                                if (itemErr) {
                                    return console.log(itemErr);
                                } else if (!itemRes) {
                                    if (item.menuGroup === group.name) {
                                        chilisMenuItems.insertOne({
                                            name: item.name,
                                            description: item.description,
                                            menuGroup: group._id,
                                            menu: menuRes._id,
                                        }, (err, res) => {
                                            if (err) {
                                                return console.log(err);
                                            } else {
                                                console.log(`Inserted item ${item.name} connected to item group id: ${item.menuGroup}`);
                                            }
                                        });
                                    }
                                } else {
                                    console.log(`Item: ${item.name} found in items collection.`);
                                }
                            });
                        });
                    });
                }
            });
        }
    });
    chilisMenuItems.find({name: {$in: ['Triple Dipper™', 'Chicken Enchilada Soup']}}).toArray((err,res) => {
        if (err) {
            return console.log(err);
        } else if (!res) {
            console.log('No results found.');
        } else {
            console.log('\n{$in: [\'Triple Dipper™\', \'Chicken Enchilada Soup\']');
            console.log(res);
        }
    });
    chilisMenuItems.find({$or: [{name: 'Triple Dipper™'}, {name: 'Chicken Enchilada Soup'}]}).toArray((err,res) => {
        if (err) {
            return console.log(err);
        } else if (!res) {
            console.log('No results found.');
        } else {
            console.log('\n$or: [{name: \'Triple Dipper™\'}, {name: \'Chicken Enchilada Soup\'}]');
            console.log(res);
        }
    });
    chilisMenuItems.find({$and: [{name: /Chicken/}, {name: /Soup/}]}).toArray((err,res) => {
        if (err) {
            return console.log(err);
        } else if (!res) {
            console.log('No results found.');
        } else {
            console.log('\n$and: [{name: /Chicken/}, {name: /Soup/}]');
            console.log(res);
        }
    });
});

