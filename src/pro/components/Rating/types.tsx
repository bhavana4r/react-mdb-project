interface RatingProps {
  className?: string;
  defaultValue?: number;
  dynamic?: boolean;
  readonly?: boolean;
  onChange?: (value: number) => void;
  style?: React.CSSProperties;
  [rest: string]: any;
}

export { RatingProps };
