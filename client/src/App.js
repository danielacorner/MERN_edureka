import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';

import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Form from './Form';

const ArtworksQuery = gql`
  {
    artworks {
      id
      title
      price
      sold
    }
  }
`;

const SellMutation = gql`
  mutation($id: ID!, $sold: Boolean!) {
    sellArtwork(id: $id, sold: $sold)
  }
`;
const RemoveMutation = gql`
  mutation($id: ID!) {
    removeArtwork(id: $id)
  }
`;
const CreateMutation = gql`
  mutation($title: String!) {
    createArtwork(title: $title) {
      id
      title
      price
      sold
    }
  }
`;

class App extends Component {
  sellArtwork = async artwork => {
    await this.props.sellArtwork({
      variables: {
        id: artwork.id,
        sold: !artwork.sold
      },
      update: (store, { data: { sellArtwork } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: ArtworksQuery });
        // Update the sold value of our artwork from the mutation.
        data.artworks = data.artworks.map(
          a =>
            a.id === artwork.id
              ? {
                  ...artwork,
                  sold: !artwork.sold
                }
              : a
        );
        // Write back our data to the cache.
        store.writeQuery({ query: ArtworksQuery, data });
      }
    });
  };
  removeArtwork = async artwork => {
    await this.props.removeArtwork({
      variables: {
        id: artwork.id
      },
      update: (store, { data: { removeArtwork } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: ArtworksQuery });
        // Update the sold value of our artwork from the mutation.
        data.artworks = data.artworks.filter(a => a.id !== artwork.id);
        // Write back our data to the cache.
        store.writeQuery({ query: ArtworksQuery, data });
      }
    });
  };
  createArtwork = async title => {
    await this.props.createArtwork({
      variables: {
        title
      },
      update: (store, { data: { createArtwork } }) => {
        // Read the data from our cache for this query.
        const data = store.readQuery({ query: ArtworksQuery });
        // Update the sold value of our artwork from the mutation.
        data.artworks.unshift(createArtwork);
        // Write back our data to the cache.
        store.writeQuery({ query: ArtworksQuery, data });
      }
    });
  };

  render() {
    const {
      data: { loading, artworks }
    } = this.props;
    if (loading) {
      return null;
    }

    return (
      <div
        className="App"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1r',
          width: '100%',
          height: '98vh',
          placeItems: 'center center'
        }}
      >
        <div style={{}}>
          <Paper elevation={1}>
            <Form onSubmit={this.createArtwork} />
            <List>
              {artworks.map(artwork => (
                <ListItem
                  key={`${artwork.id}-artwork-item`}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.sellArtwork(artwork)}
                >
                  <Checkbox
                    checked={artwork.sold}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={artwork.title} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeArtwork(artwork)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(CreateMutation, { name: 'createArtwork' }),
  graphql(SellMutation, { name: 'sellArtwork' }),
  graphql(RemoveMutation, { name: 'removeArtwork' }),
  graphql(ArtworksQuery)
)(App);
