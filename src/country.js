import React from "react";
import Inputs from "./inputs.js";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles({
  card: {
    maxWidth: 200
  },
  media: {
    height: 100
  }
});

export default class Countries extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isEmpty: false,
      isLoading: false,
      errorText: "",
      countries: []
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    this.fetchCountries();
  }

  fetchCountries = (countryName = "") => {
    if (countryName) {
      fetch(`https://restcountries.eu/rest/v2/name/${countryName}`)
        .then(res => res.json())
        .then(res => {
          if (res.status === 404) {
            throw new Error("No Data");
          }
          return res;
        })
        .then(res =>
          this.setState({
            countries: res,
            isEmpty: res.length === 0,
            isLoading: false,
            errorText: ""
          })
        )
        .catch(err =>
          this.setState({
            isLoading: false,
            errorText: err.message,
            countries: []
          })
        );
    } else {
      fetch("https://restcountries.eu/rest/v2/all")
        .then(res => res.json())
        .then(res =>
          this.setState({
            countries: res,
            isEmpty: res.length === 0,
            isLoading: false
          })
        )
        .catch(err =>
          this.setState({ isLoading: false, errorText: err.message })
        );
    }
  };

  searchCountry = countryName => {
    this.setState({ isLoading: true });

    this.fetchCountries(countryName);
  };

  render() {
    const { isEmpty, isLoading, errorText, countries } = this.state;
    const classes = useStyles;
    return (
      <div>
        <AppBar>
          <Toolbar>Search your Country</Toolbar>
        </AppBar>

        <Inputs onInputClick={this.searchCountry} />
        {errorText ? (
          <p>{errorText}</p>
        ) : isEmpty ? (
          <p>No Data</p>
        ) : isLoading ? (
          <p>Loading ...</p>
        ) : (
          countries.map(country => (
            <Card className={classes.card} id="card">
              <CardActionArea className="cardArea">
                <Typography gutterBottom variant="h5" component="h2">
                  <p key={country.name} className="paragraph">
                    Name: {country.name}
                  </p>
                  <p key={country.capital} className="paragraph">
                    Capital: {country.capital}
                  </p>
                  <p key={country.region} className="paragraph">
                    Region: {country.region}
                  </p>
                </Typography>
              </CardActionArea>
            </Card>
          ))
        )}
      </div>
    );
  }
}
