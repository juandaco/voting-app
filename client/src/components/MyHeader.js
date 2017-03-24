import React from "react";
import { Header, Textfield } from "react-mdl";

const MyHeader = ({ title, searchValue, handleSearchChange, handleSearchKeys }) => {
  return (
    <Header title={title}>
      <Textfield
        value={searchValue}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeys}
        label="Search"
        expandable
        expandableIcon="search"
      />
    </Header>
  );
};

export default MyHeader;
