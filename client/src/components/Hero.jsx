import { createStyles, Title, Text, Button, Container, rem, Avatar, Tooltip, Center } from '@mantine/core';
import { Link } from "react-router-dom"

const useStyles = createStyles((theme) => ({
  inner: {
    position: 'relative',
    zIndex: 1,
  },

  dots: {
    position: 'absolute',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],

    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  dotsLeft: {
    left: 0,
    top: 0,
  },

  title: {
    textAlign: 'center',
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan('xs')]: {
      fontSize: rem(28),
      textAlign: 'left',
    },
  },

  highlight: {
    color: theme.colors[theme.primaryColor][theme.colorScheme == 'dark' ? 4 : 6],
  },

  description: {
    textAlign: 'center',

    [theme.fn.smallerThan('xs')]: {
      textAlign: 'left',
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: 'flex',
    justifyContent: 'center',

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  control: {
    '&:not(:first-of-type)': {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan('xs')]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      '&:not(:first-of-type)': {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

function Hero() {
  const { classes } = useStyles();

  return (
    <Container   >
      <div className={classes.inner}>
        <Title className={classes.title}>
         
          <Text component="span" className={classes.highlight} inherit>
            Get Ready To Take Notes
          </Text>{' '}
         
        </Title>

        <Container p={0} size={600} >
          <Text size="lg" color="dimmed" className={classes.description}>
            Organize your thoughts effortlessly, let creativity flow, and enjoy the perfect blend of analog and digital convenience.
          </Text>
        </Container>

        <Container className={classes.controls}  >
          <Link to="/signup">
            <Button className={classes.control} size="lg" mr={20}>
              Create Account
            </Button>
          </Link>
          <Link to="/login">
            <Button className={classes.control} size="lg" variant="default" color="gray">
              Log In
            </Button>
          </Link>

        </Container>
      </div>   
    </Container>

  );
}

export default Hero