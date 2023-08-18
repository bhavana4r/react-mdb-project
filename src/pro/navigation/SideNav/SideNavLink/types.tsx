interface SideNavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  iconAngle?: number;
  shouldBeExpanded?: boolean;
  active?: boolean;
  icon?: string;
  iconClasses?: string;
  tag?: React.ComponentProps<any>;
  ref?: React.Ref<any>;
  [rest: string]: any;
}

export { SideNavLinkProps };
