import { Autocomplete, Box, TextField } from "@mui/material";
import { countries, findByCode, type Country } from "../../utils/countries";

type Props = {
  value: string; 
  onChange: (code: string) => void;
  sx?: object;
};

const CountrySelect = ({ value, onChange, sx }: Props) => (
  <Autocomplete<Country, false, true>
    options={countries}
    value={findByCode(value)}
    disableClearable
    autoHighlight
    sx={sx}
    isOptionEqualToValue={(o, v) => o.iso === v.iso}
    getOptionLabel={(o) => `${o.flag} ${o.code}`}
    filterOptions={(opts, { inputValue }) => {
      const q = inputValue.trim().toLowerCase();
      return opts.filter((o) => o.name.toLowerCase().includes(q) || o.code.includes(q) || o.iso.toLowerCase() === q);
    }}
    onChange={(_, c) => onChange(c.code)}
    renderOption={(props, o) => {
      const { key, ...rest } = props as any;
      return (
        <Box component="li" key={o.iso} {...rest} sx={{ gap: 1 }}>
          <span>{o.flag}</span>
          <span>{o.name}</span>
          <span style={{ marginLeft: "auto", opacity: 0.6 }}>{o.code}</span>
        </Box>
      );
    }}
    renderInput={(params) => <TextField {...params} label="Code" />}
  />
);

export default CountrySelect;