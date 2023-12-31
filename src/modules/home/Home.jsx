import { Box, Button, Card, CardActions, CardContent, CardMedia, Container, Grid, IconButton, MenuItem, Select, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [categoryId, setCategoryId] = useState("0");
    const [newDataList, setNewDataList] = useState("");
    const [projectImage, setProjectImage] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

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
        queryFn: getAllProject({ page: searchParams.get("page") }),
    });
    console.log('data: ', data);
    console.log(searchParams.get("page"));


    const pages = Array.from(
        { length: Math.ceil(50 / 10) },
        (_, index) => index + 1
    );


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


    const handleOnChangePage = (page) => {
        searchParams.set("page", page)
        setSearchParams(searchParams);
    };


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

    useEffect(() => {
        dispatch(getAllProject({ page: searchParams.get("page") }));
    }, [searchParams]);
    console.log("searchParams", searchParams.get("page"));


    return (
        <Container style={{ maxWidth: "1600px" }} sx={{ margin: "50px 10px", padding: "50px 10px" }} spacing={4}>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={categoryId}
                label="Dự án"
                onChange={handleChangeCategoryName}
            >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={1}>Dự án Web</MenuItem>
                <MenuItem value={2}>Dự án phần mềm</MenuItem>
                <MenuItem value={3}>Dự án Mobile</MenuItem>
            </Select>
            <Box>
                {pages.map((page, index) => (
                    <Button
                        key = {index}
                        style={{
                            border: "solid 2px",
                            marginRight: 10,
                            width: 40,
                            textAlign: "center",
                            alignItems: "center",
                        }}
                        onClick={() => { handleOnChangePage(page) }}
                    >
                        {page}
                    </Button>
                ))}
            </Box>
            <Typography variant="h6" style={{ color: `${red[500]}` }}>
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
            <Grid container sx={{ margin: "50px 10px", padding: "50px 10px" }} spacing={{ xs: 2, md: 3, lg: 4 }} columns={{ xs: 4, sm: 6, md: 12 }} style={{ alignContent: "center" }}>
                {
                    newDataList.length > 0 ? (
                        newDataList.map((item, index) => (
                            <Card sx={{ height: 520, width: 250, border: `1px ${blue[200]} solid`, margin: "5px 5px" }} key={index}>
                                <IconButton {...iconButtonSettings}>
                                    <img src={projectImage} alt="Hình ảnh" style={{ width: "100%", height: 200, display: "inline-block" }} />
                                </IconButton>
                                <Typography
                                    variant="h5"
                                    style={{ fontWeight: 700 }}
                                >
                                    {item.projectName}
                                </Typography>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            display: "inline",
                                            fontWeight: 700,
                                        }}>
                                        Thành viên:
                                    </Typography>
                                    {
                                        item.members?.map((member, index) => {
                                            return (
                                                <Typography
                                                    className="truncate truncate--2"
                                                    variant="h6"
                                                    key={index}
                                                    sx={{
                                                        display: "inline",
                                                        lineHeight: "20px",
                                                        border: `1px ${blue[200]} solid`,
                                                        backgroundColor: `${blue[100]}`,
                                                        color: `${red[500]}`,
                                                    }}
                                                >
                                                    <IconButton>
                                                        #{member.name}
                                                    </IconButton>
                                                </Typography>
                                            )
                                        })
                                    }
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        className="truncate truncate--2"
                                        sx={{
                                            fontWeight: 700,
                                        }}>
                                        Miêu tả: {item.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="medium"
                                        style={{
                                            color: "red",
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
                            <Card sx={{ height: 520, width: 250, border: `1px ${blue[200]} solid`, margin: "5px 5px" }} key={index}>
                                <IconButton {...iconButtonSettings}>
                                    {
                                        item.categoryId === 1 ? (
                                            <img src={PC_Logo} alt="Web" style={{ width: "100%", height: 200, display: "inline-block" }} />
                                        ) : (
                                            item.categoryId === 2 ? (
                                                <img src={Software_Logo} alt="Software" style={{ width: "100%", height: 200, display: "inline-block" }} />
                                            ) : (
                                                <img src={Mobile_Logo} alt="Mobile" style={{ width: "100%", height: 200, display: "inline-block" }} />
                                            )
                                        )
                                    }
                                </IconButton>
                                <Typography
                                    variant="h5"
                                    style={{ fontWeight: 700 }}
                                >
                                    {item.projectName}
                                </Typography>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            display: "inline",
                                            fontWeight: 700,
                                        }}>
                                        Thành viên:
                                    </Typography>
                                    {
                                        item.members?.map((member, index) => {
                                            return (
                                                <Typography
                                                    className="truncate truncate--2"
                                                    variant="h6"
                                                    key={index}
                                                    sx={{
                                                        display: "inline",
                                                        lineHeight: "20px",
                                                        border: `1px ${blue[200]} solid`,
                                                        backgroundColor: `${blue[100]}`,
                                                        color: "black"
                                                    }}
                                                >
                                                    <IconButton>
                                                        #{member.name}
                                                    </IconButton>
                                                </Typography>
                                            )
                                        })
                                    }
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        className="truncate truncate--2"
                                        sx={{
                                            fontWeight: 700,
                                        }}>
                                        Miêu tả: {item.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="medium"
                                        style={{
                                            color: "red",
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
        </Container >
    )
}


export default Home
