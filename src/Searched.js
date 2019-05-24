import React from "react";
import { withStyles, Paper } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const style = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(3, 2),
    margin: theme.spacing(3, 2)
  }
});

const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
  return (
    <text
      x={x + width / 2}
      y={y}
      fill="#666"
      textAnchor="middle"
      dy={-6}
    >{`${value}`}</text>
  );
};

class Searched extends React.Component {
  state = {
    query: this.props.query,
    keywords: [],
    pos: [],
    neg: []
  };

  componentDidMount = () => {
    axios
      .get("http://127.0.0.1:5000/search/" + this.state.query)
      .then(response => {
        console.log(response.data);
        if (response.data.get == "success") {
          this.setState({ keywords: response.data.keywords.items });
          this.setState({ pos: response.data.pos.items });
          this.setState({ neg: response.data.neg.items });
        } else {
          alert("분석을 시작했습니다\n잠시 뒤에 다시 검색하세요");
          // TODO : 첫 화면으로 돌아가기
        }
      })
      .catch(response => alert(response));
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div>
          <AppBar position="static" color="default">
            <Toolbar>
              <Typography variant="h6" color="inherit">
                {this.props.query}
              </Typography>
            </Toolbar>
          </AppBar>
        </div>
        <div>
          <Paper className={classes.paper}>
            <Typography variant="h5">단어별 빈도수</Typography>
            <Divider />
            <BarChart width={800} height={200} data={this.state.keywords}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#ccc" }} />
              {/* <CartesianGrid stroke="#eee" strokeDasharray="5 5"/> */}
              <Bar
                type="monotone"
                dataKey="count"
                fill="#009BE4"
                label={renderCustomBarLabel}
              />
            </BarChart>
          </Paper>
        </div>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="h5">Keywords</Typography>
                <Divider />
                <Grid container spacing={1}>
                  {this.state.keywords.map((item, i) => {
                    return (
                      <Grid item xs={6}>
                        {item.name}
                      </Grid>
                    );
                  })}
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h5">POS</Typography>
                <Divider />
                {this.state.pos.map((item, i) => {
                  return (
                    <Grid item xs={12}>
                      {item}
                    </Grid>
                  );
                })}
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <Typography variant="h5">NEG</Typography>
                <Divider />
                {this.state.neg.map((item, i) => {
                  return (
                    <Grid item xs={12}>
                      {item}
                    </Grid>
                  );
                })}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withStyles(style)(Searched);
