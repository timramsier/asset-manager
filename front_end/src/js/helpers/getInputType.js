import {
  Text,
  TextArea,
  KeyValueGroup,
  Select,
  ImageUpload,
  AssetInputGroup,
  ReadOnly,
  Password,
} from '../Components/InputTypes/InputType';

const inputMap = {
  text: Text,
  textarea: TextArea,
  keyvalue: KeyValueGroup,
  select: Select,
  image: ImageUpload,
  asset: AssetInputGroup,
  readonly: ReadOnly,
  password: Password,
};

export default type => {
  const inputReturn = inputMap[type];
  if (!inputReturn) {
    console.error(
      `Error: ${type} is an invalid input type.  Please use a valid input type.`
    );
    return () => null; // return function that returns null to not block page load
  }
  return inputReturn;
};
