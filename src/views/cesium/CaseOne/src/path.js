/**
 * 轨迹路径
 * @param viewer
 * @param id
 * @param paths
 */
export function setModelScale(viewer, id, size = 1) {
    let e = viewer.entities.getById(id)
    if (e) {
        e.model.scale = size
    }
}

export function initPath({viewer, id, paths, speed, model}) {
    console.log(viewer, id, paths, speed, model)
    let e = viewer.entities.getById(id)
    if (e) {
        return
    }
    let length = 1
    console.log('paths.length', paths.length)
    let duration = length * (paths.length - 1)
    var utc = Cesium.JulianDate.fromDate(new Date());
    var start = Cesium.JulianDate.addHours(utc, 8, new Cesium.JulianDate());//北京时间=UTC+8=GMT+8
    var stop = Cesium.JulianDate.addSeconds(start, duration, new Cesium.JulianDate());

    viewer.clock.startTime = start.clone();
    viewer.clock.stopTime = stop.clone();
    viewer.clock.currentTime = start.clone();
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = speed || 1;
    viewer.clock.shouldAnimate = true;
    viewer.scene.light = new Cesium.DirectionalLight({ //去除时间原因影响模型颜色
        direction: new Cesium.Cartesian3(0.35492591601301104, -0.8909182691839401, -0.2833588392420772)
    })

    let flypath = () => {
        var property = new Cesium.SampledPositionProperty();
        for (let i = 0; i < paths.length; i++) {
            let time = Cesium.JulianDate.addSeconds(start, i * length, new Cesium.JulianDate());
            let position = Cesium.Cartesian3.fromDegrees(paths[i][0], paths[i][1], paths[i][2]);
            property.addSample(time, position);
        }
        return property;
    }
    let position = flypath();
    let entity = viewer.entities.add({
        id: id,
        position: position,
        orientation: new Cesium.VelocityOrientationProperty(position),
        // distanceDisplayCondition: false,
        model: {
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            uri: model || 'static/Models/jlh.glb',
            scale: 0.5,
        },
        billboard: {
            // image: 'static/haishanimage/boat.png',
            // width: 30 ,
            // height: 30,
            // extrudedHeight:100
        },
        path: {
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            resolution: 1,
            leadTime: duration,
            trailTime: duration,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.YELLOW
            }),
            width: 0
        }
    });
    // https://www.cnblogs.com/giserhome/p/11061499.html
    // entity.position.setInterpolationOptions({
    //   interpolationDegree: 10,
    //   interpolationAlgorithm: LagrangePolynomialApproximation
    // })
}

/**
 * 视图追踪，
 */
let renderListener = null

export function trackEntity({viewer, id, fixed, camera}) {
    let entity = viewer.entities.getById(id)
    viewer.trackedEntity = entity;
    //视角变换
    let matrix3Scratch = new Cesium.Matrix3();

    function getModelMatrix(entity, time, result) {
        var position = Cesium.Property.getValueOrUndefined(
            entity.position,
            time,
            new Cesium.Cartesian3()
        );
        if (!Cesium.defined(position)) {
            return undefined;
        }
        let orientation = Cesium.Property.getValueOrUndefined(
            entity.orientation,
            time,
            new Cesium.Quaternion()
        );
        if (!Cesium.defined(orientation)) {
            result = Cesium.Transforms.eastNorthUpToFixedFrame(
                position,
                undefined,
                result
            );
        } else {
            result = Cesium.Matrix4.fromRotationTranslation(
                Cesium.Matrix3.fromQuaternion(orientation, matrix3Scratch),
                position,
                result
            );
        }
        return result;
    }

    let scratch = new Cesium.Matrix4();
    renderListener = function (e) {
        if (viewer.camera.position.z < 0) {
            viewer.camera.setView(camera)
        }
        if (viewer.trackedEntity && fixed) {
            getModelMatrix(viewer.trackedEntity, viewer.clock.currentTime, scratch);
            var transformX = 120; //距离运动点的距离（后方）
            var transformZ = 20; //距离运动点的高度（上方）
            var transformY = 10; //距离运动点的高度（侧方）
            viewer.scene.camera.lookAtTransform(
                scratch,
                new Cesium.Cartesian3(-transformX, transformY, transformZ)
            );
        }
    };
    viewer.scene.preUpdate.addEventListener(renderListener)
}

export function stopTrackEntity(viewer) {
    if (renderListener) {
        viewer.scene.preUpdate.removeEventListener(renderListener)
    }
    viewer.trackedEntity = undefined
}
