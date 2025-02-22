import React from 'react';
import { withRouter } from 'next/router';
import Head from '../../../components/head';
import Layout from "../../../components/layout";
import Loader from '../../../components/loader';
import FieldWithElement from '../../../components/FieldWithElement';
import controller from '../../../controllers/coupons';
import "../../../styles/pages/admin/coupons.scss";
import Swal from 'sweetalert2';
import ProductsChooser from "../../../components/ProductsChooser";
import CheckLogin from "../../../components/CheckLogin";

class AddCoupon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      queryParams: {
        authority_doc: "",
        code: "",
        products: [],
        type: "online",
        mode: "flat",
        left: 1,
        category: "special_discount",
        active: false
      },
    };
  }

  /**
   * Changes the value of the specified key in the queryParams object
   * in state.
   * @param {SyntheticEvent} event – Handles an event from a form
   * @example
   *  <input
   *   type="text"
   *   name="email"
   *   onChange={this.handleQueryParamChange}
   *  />
   *  // Changes the value of this.state.queryParams.email
   */
    handleQueryParamChange = (event) => {
        let newQueryParams = this.state.queryParams;
        if (event.target.name === 'allProducts'
            || event.target.name === 'allExtensions'
            || event.target.name === 'active') {
            newQueryParams[event.target.name] = event.target.checked;
        } else {
            newQueryParams[event.target.name] = event.target.value;
        }
        this.setState(prevState => ({
            queryParams: newQueryParams
        }));
    };

  /**
   * Callback function for ProductsChooser component that updates
   * them in the state when ProductsChooser returns an array of
   * products added
   * @param {array} products – Array of with the names of products
   */
  handleProductsChange = (products) => {
    let queryParams = this.state.queryParams;
    queryParams['products'] = products;
    this.setState({
      queryParams
    })
  }


  /**
   * Method to handle saving of coupon
   */
  handleAddCoupon = (event) => {
    event.preventDefault();
    // Show the loading icon
    if (!document.getElementById("addCouponForm").checkValidity()) {
      document.getElementById("addCouponForm").reportValidity();
    } else {
      this.setState({
        loading: true
      });
      controller.handleAddCoupon(this.state.queryParams).then((response) => {
        this.setState({
          loading: false
        });
        Swal.fire({
          title: "Coupon " + this.state.queryParams.code + " added!",
          type: "success",
          showConfirmButton: true
        });
      }).catch((error) => {
        this.setState({
          loading: false
        });
        Swal.fire({
          title: "Error adding coupon!",
          text: error,
          type: "error",
          showConfirmButton: true
        });
      });
    }
  }

  render() {
    return (
      <div>
        <Head title="Coding Blocks | Dukaan | Add Coupon" />
        <Layout />
        <CheckLogin>
          <div className={"d-flex align-items-center justify-content-center"}>
            <div className={"border-card coupon-card col-md-4 mt-5"}>
              {this.state.loading &&
                <Loader />
              }
              {!this.state.loading &&
                <form id="addCouponForm" onSubmit={(e) => e.preventDefault()}>
                  <div className={"add-coupon-card"}>

                    {/* Title */}
                    <div className={"d-flex justify-content-center mt-1 pb-3"}>
                      <h2 className={"title"}>Add Coupon</h2>
                    </div>

                    {/* Code */}
                    <FieldWithElement name={"Code*"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                      <input
                        type="text"
                        className="input-text"
                        placeholder="Enter Code"
                        name="code"
                        defaultValue={this.state.queryParams.code}
                        onChange={this.handleQueryParamChange}
                        required
                      />
                    </FieldWithElement>
                    {/* Authority_code */}
                    <FieldWithElement name={"Description*"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                      <input
                        type="text"
                        className="input-text"
                        placeholder="Enter Description"
                        name="authority_doc"
                        defaultValue={this.state.queryParams.authority_doc}
                        onChange={this.handleQueryParamChange}
                        required
                      />
                    </FieldWithElement>
                    {/* Categories */}
                    <FieldWithElement name={"Category*"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                      <select
                        id="category"
                        name="category"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.category}
                        required
                      >
                        <option value="special_discount">Special Discount</option>
                        <option value="campaign">Campaign</option>
                        <option value="campus_ambassador">Campus Ambassador</option>
                      </select>
                    </FieldWithElement>

                    {/* Products */}
                    <FieldWithElement name={"Products"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                      <ProductsChooser
                        productsCallback={this.handleProductsChange}
                        multiple={true}
                      />
                    </FieldWithElement>

                    {/* Mode */}
                    <FieldWithElement name={"Mode*"} nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                      <select
                        id="mode"
                        name="mode"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.mode}
                        required
                      >
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                      </select>
                    </FieldWithElement>

                    {this.state.queryParams.mode == "flat" &&
                      /* Amount */
                      <FieldWithElement
                        name={"Discount*"}
                        nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                        <input
                          type="number"
                          className={"input-text"}
                          placeholder="Enter discount value"
                          name="amount"
                          onChange={this.handleQueryParamChange}
                          title="Discount can only have 3 to 10 digit numbers"
                          required
                        />
                      </FieldWithElement>
                    }

                    {this.state.queryParams.mode == "percentage" &&
                      /* Percentage */
                      <FieldWithElement
                        name={"Percentage*"}
                        nameCols={3} elementCols={9} elementClassName={"pl-4"}>
                        <input
                          type="text"
                          className={"input-text"}
                          placeholder="Enter Percentage"
                          name="percentage"
                          defaultValue={this.state.queryParams.percentage}
                          onChange={this.handleQueryParamChange}
                          required
                        />
                      </FieldWithElement>
                    }

                    {/* Total number of times a coupon can be used*/}
                    <FieldWithElement name={"How many times it can be used?*"} nameCols={6} elementCols={6} elementClassName={"pl-4"}>
                      <input
                        type="number"
                        className={"input-text"}
                        placeholder="Enter Left"
                        name="left"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.left}
                        min={1}
                        title="Left can only have numbers"
                        required
                      />
                    </FieldWithElement>

                    {/* All Listed Products? */}
                  <div className={"mt-3 row d-flex"}>
                      <div className={"col-md-6"}>
                      <span className="text">Add All Listed Products?</span>
                      </div>
                      <div className={"col-md-6"}>
                      <input
                        className={"ml-4 mt-3"}
                        type="checkbox"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.allProducts}
                        name="allProducts" />
                      </div>
                      </div>
                    {/* Min price */}
                    <FieldWithElement name={"Minimum Product Price?"} nameCols={6} elementCols={6} elementClassName={"pl-4"}>
                      <input
                        type="number"
                        className={"input-text"}
                        placeholder="Min product price"
                        name="minProductPrice"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.minProductPrice}
                        title="minProductPrice can only have numbers"
                      />
                    </FieldWithElement>

                    {/* All Listed Extensions? */}
                  <div className={"mt-3 row d-flex"}>
                      <div className={"col-md-6"}>
                      <span className="text">Add All Listed Extensions?</span>
                      </div>
                      <div className={"col-md-6"}>
                      <input
                        className={"ml-4 mt-3"}
                        type="checkbox"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.allExtensions}
                        name="allExtensions" />
                      </div>
                      </div>
                    {/* Min price */}
                    <FieldWithElement name={"Minimum Extension Price?"} nameCols={6} elementCols={6} elementClassName={"pl-4"}>
                      <input
                        type="number"
                        className={"input-text"}
                        placeholder="Min extension price"
                        name="minExtensionPrice"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.minExtensionPrice}
                        title="minExtensionPrice can only have numbers"
                      />
                    </FieldWithElement>

                    {/* Active */}
                  <div className={"mt-3 row d-flex"}>
                      <div className={"col-md-6"}>
                      <span className="text">Activate</span>
                      </div>
                      <div className={"col-md-6"}>
                      <input
                        className={"ml-4 mt-3"}
                        type="checkbox"
                        onChange={this.handleQueryParamChange}
                        defaultValue={this.state.queryParams.active}
                        name="active" />
                      </div>

                      </div>

                    <div className={"d-flex justify-content-center"}>
                      <button
                        id="search"
                        className={"button-solid ml-4 mb-2 mt-4 pl-5 pr-5"}
                        onClick={this.handleAddCoupon}
                      >
                        Add
                    </button>
                    </div>
                  </div>
                </form>
              }
            </div>
          </div>
        </CheckLogin>
      </div>
    )
  }

}

export default withRouter(AddCoupon);
