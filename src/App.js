import React, { Component } from 'react';
import './App.css';
import 'bootswatch/dist/yeti/bootstrap.min.css';
import Navbar from './Components/NavbarC.js';
import Newsletter from './Components/Newsletter';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Components/Home.js';
import About from './Components/About.js';
import NoMatch from './Components/NoMatch.js';
import Products from './Components/Products.js';
import Basket from './Components/Basket.js';
import SingleProduct from './Components/SingleProduct';
import myFirebase from './Components/myFirebaseConfig.js';
import Firebase from 'firebase';

class App extends Component {
  constructor(props) {
    super(props);
    // get product data from api and store in state
    const categories = [
      'Health & Beauty',
      'Food & Drink',
      'Clothing & Fashion',
      'Jewellery',
      'Sport ',
      'Gardening & DIY',
      'Home',
      'Art',
    ];
    this.state = {
      apiData: [],
      delivery: [], // I think that this variable may be superfluous now (GM)
      isFetched: false,
      errorMsg: null,
      deliveryData: [],
      freeDeliveryThreshold: 100,
      productFilters: { category: [] },
      basket: [],
      filteredProducts: [],
      searchTerm: '',
      deliveryDetails: false,
      emailData: [],
      checked: [],
      checkboxes: categories.reduce(
        (allCategories, singleCategory) => ({
          ...allCategories,
          [singleCategory]: false,
        }),
        {}
      ),
    };

    this.addToBasket = this.addToBasket.bind(this);
    this.emptyBasket = this.emptyBasket.bind(this);
    this.removeFromBasket = this.removeFromBasket.bind(this);
    this.onSearchFormChange = this.onSearchFormChange.bind(this);
    this.clearSearchBox = this.clearSearchBox.bind(this);
    this.shuffle = this.shuffle.bind(this);
    this.getMessagesFromDatabase = this.getMessagesFromDatabase.bind(this);
    this.addItemToEmails = this.addItemToEmails.bind(this);
  }

  addToBasket(id) {
    //use unique ID from productCard map function to filter for element in apiData
    let item = this.state.apiData.filter(
      //variable item to hold the element
      this.getItem(id) //call getItem function to return object
    );

    const checkIfProductInBasket = this.state.basket.filter((p) => p.id === id);
    
    if (checkIfProductInBasket.length > 0) {
      this.setState((prevState) => ({
        basket: prevState.basket.map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        ),
      }));
      this.setState({ checkoutButton: false });



    } else 
    
    
    {
      item[0].quantity = 1;
      this.setState({ basket: this.state.basket.concat(item) }); //add item to basket array
      this.setState({ checkoutButton: false });
    }
  }
  getItem(a) {
    //returns correct object from array when passed an element
    return function (obj) {
      return obj.id === a;
    };
  }
  emptyBasket() {
    //remove all items from basket array
    this.setState({ basket: [] });
  }
  
  removeFromBasket(i) {
    let bArray = this.state.basket;
    let itemIndex = bArray.findIndex(this.getItem(i));
    bArray.splice(itemIndex, 1);
    this.setState({ basket: bArray });
  }
  checkoutButton() {
    this.emptyBasket();
  }

  handleCheckboxChange = async (e) => {
    const { value } = e.target;
    // this.setState((prevState) => ({
    //   checkboxes: {
    //     ...prevState.checkboxes,
    //     [value]: !prevState.checkboxes[value],
    //   },
    // }));
    const currentIndex = this.state.checked.indexOf(value);
    const newCheckedArray = [...this.state.checked];

    if (currentIndex === -1) {
      newCheckedArray.push(value);
    } else {
      newCheckedArray.splice(currentIndex, 1);
    }

    await this.setState({ checked: value });
    await this.handleFilter(newCheckedArray);
  };

  async handleFilter(filters, category) {
    const newFilter = { ...this.state.productFilters };
    newFilter[0] = filters;
    this.setState({ productFilters: newFilter });
    const data = this.state.apiData;
    let filteredData = data.filter((p) =>
      this.state.checked.includes(p.tags[2])
    );

    this.setState({ filteredProducts: filteredData });
  }

<<<<<<< HEAD
  componentDidMount() {
=======
 componentDidMount() {
>>>>>>> f51e8fa2ee4e6006ce5eb7940f3baa6ee5fd708d
    try {
      this.getMessagesFromDatabase();
    } catch (error) {
      this.setState({ Msgerror: error });
    } // end of try catch
  } // end of componentDidMount()

  getMessagesFromDatabase() {
    let ref1 = Firebase.database().ref('products');

    ref1.on('value', (snapshot) => {
      // json array
      let msgData = snapshot.val();
      let newMessagesFromDB1 = [];
      for (let m in msgData) {
        // create a JSON object version of our object.
        let currObject = {
          description: msgData[m].description,
          id: msgData[m].id,
          image: msgData[m].image,
          manufacturer: msgData[m].manufacturer,
          manufacturer_website: msgData[m].manufacturer_website,
          name: msgData[m].name,
          price: msgData[m].price,
          weight: msgData[m].weight,
          tags: msgData[m].tags,
        };
        // add it to our newStateMessages array.
        newMessagesFromDB1.push(currObject);
      } // end for loop
      // set state = don't use concat.
      this.setState({ apiData: newMessagesFromDB1.sort(this.shuffle) });
    });

    let ref2 = Firebase.database().ref('deliveryCost');

    ref2.on('value', (snapshot) => {
      // json array
      let msgData = snapshot.val();
      let newMessagesFromDB2 = [];
      for (let m in msgData) {
        // create a JSON object version of our object.
        let currObject = {
          cost: msgData[m].Cost,
          size: msgData[m].size,
          weight: msgData[m].weight,
        };
        // add it to our newStateMessages array.
        newMessagesFromDB2.push(currObject);
      } // end for loop
      // set state = don't use concat.
      this.setState({ deliveryData: newMessagesFromDB2 });
    });

    let ref3 = Firebase.database().ref('freeDeliveryThreshold');
    ref3.on('value', (snapshot) => {
      // json array
      let msgData = snapshot.val();

      this.setState({ freeDeliveryThreshold: msgData });
    });

    let ref4 = Firebase.database().ref("emails");
    ref4.on("value", (snapshot) => {
      // json array
      let msgData = snapshot.val();
      let newMessagesFromDB3 = [];
      for (let m in msgData) {
        // create a JSON object version of our object
        let currObject = {
          id: msgData[m].id,
          address: msgData[m].address
        };
        // add to the local array
        newMessagesFromDB3.push(currObject);
      } // end of for loop
      this.setState({ emailData: newMessagesFromDB3 });
    });
  }

  shuffle(productA, productB) {
    let comparison = 0;
    comparison = Math.random() - 0.5;
    return comparison;
  }

  onSearchFormChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  productFilterFunction(searchTerm) {
    return function (libraryObject) {
      let name = libraryObject.name.toLowerCase();
      let description = libraryObject.description.toLowerCase();

      if (searchTerm.length === 0) {
        return libraryObject;
      }
      return (
        searchTerm !== '' &&
        searchTerm.length >= 3 &&
        (name.includes(searchTerm.toLowerCase()) ||
          description.includes(searchTerm.toLowerCase()))
      );
    };
  }

  filteredCategories() {
    this.state.apiData.filter((p) =>
      this.state.categoriesTest.every((c) => p.tags[2].includes(c))
    );
  }

  clearSearchBox(e) {
    e.preventDefault();
    this.setState({ searchTerm: '' });
  }

  viewBasket() {
    if (this.state.viewBasket === false) this.setState({ viewBasket: true });
    else {
      this.setState({ viewBasket: false });
    }
  }

  /* append a new email address to the JSON array in firebase */
  addItemToEmails(address) {
    // get the current state array for emails
    let localEmails = this.state.emailData;

    // generate a new ID (no validation on this.)
    let addressId = String(this.state.emailData.length + 1);

    // combine id and address for new object to be added
    let newAddressObj = {
      id: addressId,
      address: address
    }

    // append the new object to the local array
    localEmails.push(newAddressObj);

    // overwrite the emails array in firebase
    Firebase.database().ref("emails").set(localEmails);

    // update state with the list
    this.setState({ emailData: localEmails });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Navbar basket={this.state.basket} />
          <div className="container">
            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <Products
                    errorMsg={this.state.errorMsg}
                    apiData={this.state.apiData}
                    addToBasket={this.addToBasket}
                    random={this.state.random}
                    handleSearch={this.onSearchFormChange}
                    checkboxChange={this.handleCheckboxChange}
                    filteredProducts={this.state.filteredProducts}
                    checkboxes={this.state.checkboxes}
                    searchTerm={this.state.searchTerm}
                    clearSearch={this.clearSearchBox}
                    productFilter={this.productFilterFunction}
                    handleFilter={(filters) =>
                      this.handleFilter(filters, 'categories')
                    }
                    checked={this.state.checked}
                  />
                )}
              />
              {/*<Route path="/Home" component={Home} />*/}
              <Route path="/About" component={About} />
              <Route 
                path="/Newsletter" 
                render={(props) => (
                  <Newsletter
                    emails={this.state.emailData}
                    addItemToEmails={this.addItemToEmails}
                  />
                )}
              />
              <Route
                path="/Products/:productid"
                render={(props) => (
                  <SingleProduct
                    data={this.state.apiData}
                    addToBasket={this.addToBasket}
                    {...props}
                  ></SingleProduct>
                )}
              />
              <Route
                path="/Basket"
                render={() => (
                  <Basket
                    state={this.state}
                    apiData={this.state.apiData}
                    emptyBasket={this.emptyBasket}
                    removeFromBasket={this.removeFromBasket}
                    checkoutButton={this.checkoutButton}
                    addToBasket ={this.addToBasket}
                    freeDeliveryThreshold = {this.state.freeDeliveryThreshold}
                    deliveryData={this.state.deliveryData}
                    
                  />
                )}
              />
              {/* <Route
                path="/Products"
                render={() => (
                  <Products
                    apiData={this.state.apiData}
                    addToBasket={this.addToBasket}
                  />
                )}
              /> */}
              <Route component={NoMatch} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
