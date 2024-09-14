import Avatar from '@material-ui/core/Avatar';
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import Badge from '@material-ui/core/Badge';
import { Theme, makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import './About.css'

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
  }),
)(Badge);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      '& > *': {
        margin: theme.spacing(3),
      },
    },
  }),
);

export default function BadgeAvatars() {
  const classes = useStyles();

  return (
    <div className='page-wrapper category-html'>
      <div className="sticky-header-container">
        <header className="top-navigation">
          <Navbar />
        </header>
      </div>
      <div className="about-container">
        <h1>开发者</h1>
        <div className="avatar-wrapper">
          <div className={classes.root}>
            <div className="avatar-single">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant="dot"
              >
                <Avatar alt="Remy Sharp" src="/src/assets/pcs.jpg" />
              </StyledBadge>
              <span>布洛芬</span>
            </div>
            <div className="avatar-single">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant="dot"
              >
                <Avatar alt="Travis Howard" src="/src/assets/swl.jpg" />
              </StyledBadge>
              <span>吞吞</span>
            </div>
            <div className="avatar-single">
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                variant="dot"
              >
                <Avatar alt="brk" src="/src/assets/brk.jpg" />
              </StyledBadge>
              <span>小砖</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

