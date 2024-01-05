import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Divider, Grid, IconButton, MenuItem, Select, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getAllProject } from '../../apis/project.api';
import { useQuery } from '@tanstack/react-query';
import Slider from 'react-slick'
import { blue } from '@mui/material/colors';
import { red } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import { Scrollbar } from 'react-scrollbars-custom';
import Paper from '@mui/material/Paper';
import PC_Logo from "../../assets/img/PC_Logo.webp"
import Mobile_Logo from "../../assets/img/Mobile_Logo.png"
import Software_Logo from "../../assets/img/Software_Logo.jpg"
import { useDispatch } from 'react-redux';
import { projectListAction } from "../../redux/slices/project.slice"

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [categoryId, setCategoryId] = useState("0");
    const [newDataList, setNewDataList] = useState("");
    const [projectImage, setProjectImage] = useState("");

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'grey' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const sliderSettings = {
        className: "center",
        centerMode: true,
        centerPadding: "60px",
        // infinite: true,
        speed: 500,
        // autoplaySpeed: 2000,
        slidesToShow: 4,
        autoplay: false,
        initialSlide: 0,
        rows: 2,
        dots: true,
        swipeToSlide: true,
        customPaging: i => (
            <div
                style={{
                    margin: "5px",
                    padding: "2px",
                    fontSize: 20,
                    width: "30px",
                    border: `1px ${blue[500]} solid`,
                    borderRadius: "5px",
                }}
            >
                {i + 1}
            </div>
        )
    };

    const iconButtonSettings = {
        style: {
            fontSize: 50,
        }
    }

    const { data = [], isLoading, isError, error } = useQuery({
        queryKey: ["allProject"],
        queryFn: getAllProject,
    });


    // đưa data lên store của Redux để qua bên trang Project Management khỏi call API lần nữa
    const sendDataToReduxStore = async () => {
        try {
            const response = await data
            if (data && data.length > 0) {
                dispatch(projectListAction.setProjectList(data));
            }
            return response;
        }
        catch (error) {
            throw Error(error)
        }
    }
    if (data && data.length > 0) {
        sendDataToReduxStore();
    }


    const handleFirstDataList = () => {
        let newData = [];
        for (let index in data) {
            if (categoryId === data[index].categoryId) {
                newData.push(data[index]);
            }
        }
        setNewDataList(newData);
    }


    const handleChangeCategoryName = (event) => {
        setCategoryId(event.target.value);
    };


    const handleChangeDataList = () => {
        let newData = [];
        for (let index in data) {
            if (categoryId === data[index].categoryId) {
                newData.push(data[index]);
            }
            if (categoryId === 1) {
                setProjectImage(PC_Logo);
            }
            else if (categoryId === 2) {
                setProjectImage(Software_Logo);
            }
            else if (categoryId === 3) {
                setProjectImage(Mobile_Logo);
            }
        }
        setNewDataList(newData);
    }


    // khi data thay đổi (>0) thì mặc định render ra thằng đầu tiên
    useEffect(() => {
        if (data.length > 0) {
            handleFirstDataList();
        }
    }, [data]);

    // khi categoryId thay đổi thì mặc định render ra thằng đầu tiên
    useEffect(() => {
        if (data.length > 0) {
            handleChangeDataList();
        }
    }, [categoryId]);


    return (
        <div style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
            <Container style={{ maxWidth: "80vw" }} sx={{ margin: "60px 60px", padding: "24px", boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)" }}>
                <Box style={{ fontSize: 18, padding: "10px", boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)" }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={categoryId}
                        onChange={handleChangeCategoryName}
                        sx={{ height: "40px" }}
                    >
                        <MenuItem value={0}>Tất cả</MenuItem>
                        <MenuItem value={1}>Dự án web</MenuItem>
                        <MenuItem value={2}>Dự án phần mềm</MenuItem>
                        <MenuItem value={3}>Dự án di động</MenuItem>
                    </Select>
                    <Typography style={{ color: `${red[500]}`, marginTop: 10 }}>
                        Có tất cả
                        {
                            newDataList.length > 0 ? (
                                ` ${newDataList.length} `
                            ) : (
                                ` ${data.length} `
                            )
                        }
                        dự án tìm thấy
                    </Typography>
                </Box>
                <Scrollbar
                    className="ScrollbarsCustom-Content"
                    style={{ width: "100%", height: 1000 }}
                >
                    <Grid container sx={{ margin: "30px 30px", alignItems: 'center', boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.12)" }} spacing={{ xs: 2, md: 3, lg: 4 }} columns={{ xs: 4, sm: 6, md: 8, lg: 10, xl: 12 }} style={{ alignContent: "center" }}>
                        {
                            newDataList.length > 0 ? (
                                newDataList.map((item, index) => (
                                    <Card sx={{ height: 400, width: 200, border: `1px ${blue[200]} solid`, margin: "5px 5px" }} key={index}>
                                        <CardContent>
                                            <IconButton {...iconButtonSettings}>
                                                <img src={projectImage} alt="Mobile"
                                                    style={{ width: "90%", height: "auto", display: "inline-block" }}
                                                />
                                            </IconButton>
                                            <Divider width="100%" />
                                            <Typography
                                                style={{ fontWeight: 700, fontSize: 20 }}
                                            >
                                                {item.projectName}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    display: "inline",
                                                    fontSize: 18,
                                                    fontWeight: 500,
                                                }}>
                                                Thành viên1:
                                            </Typography>
                                            {
                                                item.members.length > 0 ? (
                                                    item.members.map((member, index) => {
                                                        return (
                                                            <Button
                                                                size='small'
                                                                variant='outlined'
                                                                sx={{ fontSize: 12 }}
                                                                key={index}
                                                            >
                                                                #{member.name}
                                                            </Button>
                                                        )
                                                    })
                                                ) : (
                                                    <Typography color={"red"}>
                                                        Chưa có
                                                    </Typography>
                                                )
                                            }
                                            <Typography
                                                component="div"
                                                className="truncate truncate--2"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: 18,
                                                }}>
                                                Miêu tả: {item.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small"
                                                style={{
                                                    color: `${blue[500]}`,
                                                }}
                                                onClick={() => {
                                                    // navigate(`movie/${item.maPhim}`)
                                                }}
                                            >
                                                [...Xem chi tiết]
                                            </Button>
                                        </CardActions>
                                    </Card>
                                ))
                            ) : (
                                data.map((item, index) => (
                                    <Card sx={{ height: 400, width: 200, border: `1px ${blue[200]} solid`, margin: "5px 5px" }} key={index}>
                                        <CardContent>
                                            <IconButton {...iconButtonSettings}>
                                                {
                                                    item.categoryId === 1 ? (
                                                        <img src={PC_Logo} alt="Mobile" style={{ width: "90%", height: "auto", display: "inline-block" }} />
                                                    ) : (
                                                        item.categoryId === 2 ? (
                                                            <img src={Software_Logo} alt="Mobile" style={{ width: "100%", height: "auto", display: "inline-block" }} />
                                                        ) : (
                                                            <img src={Mobile_Logo} alt="Mobile" style={{ width: "100%", height: "auto", display: "inline-block" }} />
                                                        )
                                                    )
                                                }
                                            </IconButton>
                                            <Divider width="100%" />
                                            <Typography
                                                style={{ fontWeight: 700, fontSize: 20 }}
                                            >
                                                {item.projectName}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    display: "inline",
                                                    fontWeight: 500,
                                                    fontSize: 18,
                                                }}>
                                                Thành viên:
                                            </Typography>
                                            {
                                                item.members.length > 0 ? (
                                                    item.members.map((member, index) => {
                                                        return (
                                                            <Button
                                                                size='small'
                                                                variant='outlined'
                                                                sx={{ fontSize: 12 }}
                                                                key={index}
                                                            >
                                                                #{member.name}
                                                            </Button>
                                                        )
                                                    })
                                                ) : (
                                                    <Typography color={"red"}>
                                                        Chưa có
                                                    </Typography>
                                                )
                                            }
                                            <Typography
                                                component="div"
                                                className="truncate truncate--2"
                                                sx={{
                                                    fontWeight: 500,
                                                    fontSize: 18,
                                                }}>
                                                Miêu tả: {item.description}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small"
                                                style={{
                                                    color: `${blue[500]}`,
                                                }}
                                                onClick={() => {
                                                    // navigate(`movie/${item.maPhim}`)
                                                }}
                                            >
                                                [...Xem chi tiết]
                                            </Button>
                                        </CardActions>
                                    </Card>
                                ))
                            )
                        }
                    </Grid>
                </Scrollbar>
            </Container >
        </div >
    )
}


export default Home
