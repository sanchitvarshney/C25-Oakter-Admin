import React from "react";
import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/hooks/useReduxHook";
import { userList } from "@/features/history/historySlice";

export type UserType = {
  id: string;
  text: string;
};


type Props = {
  onChange: (value: UserType | null) => void;
  value: UserType | null | undefined;
  label?: string;
  width?: string;
  error?: boolean;
  helperText?: string | null;
  varient?: "outlined" | "standard" | "filled";
  required?: boolean;
  size?: "small" | "medium";
};

const SelectUser: React.FC<Props> = ({
  value,
  onChange,
  label = "Search User",
  width = "100%",
  error,
  helperText,
  varient = "filled",
  required = false,
  size = "medium",
}) => {
 const dispatch = useAppDispatch();
   const { userListLoading, userListData } = useAppSelector((state) => state.history);

  // Fetch users based on search input
  const fetchUsers = async () => {
       dispatch(userList())
  };

 

  return (
    <Autocomplete
      onFocus={fetchUsers}
      value={value}
      size={size}
      options={userListData || []}
      getOptionLabel={(option:any) => `${option?.username?.split("-")[0]}`}
      filterOptions={(options) => options} 
      filterSelectedOptions
      onChange={(_, value) => {
        onChange(value);
      }}
      loading={userListLoading}
      isOptionEqualToValue={(option:any, value:any) => option.custID === value?.custID}
    
      renderInput={(params) => (
        <TextField
          required={required}
          error={error}
          helperText={helperText}
          {...params}
          // label={label}
          placeholder={label}
          variant={varient}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {userListLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option:any) => (
        <li
          {...props}
          className="flex flex-col px-[10px] py-[5px] hover:bg-cyan-50 cursor-pointer"
        >
          <Typography fontWeight={500}>{option.username.split("-")[0]}</Typography>
          <Typography fontSize={12}>{option.username.split("-")[1]}</Typography>
        </li>
      )}
      sx={{ width }}
    />
  );
};

export default SelectUser;
