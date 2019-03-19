package services;

import skynet.scheduler.common.Course;
import skynet.scheduler.common.ICourse;
import skynet.scheduler.common.SemesterSeasons;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class AttachSeason {

    private static ExecutorService executorService;
    private static int NUM_THREADS = 20;

    public static void attachSeasons(ICourse courses, CourseService service){
        List<ICourse> c = new ArrayList<>();
        c.add(courses);
        attachSeasons(c, service);
    }

    public static void attachSeasons(List<ICourse> courses, CourseService service){

        executorService = Executors.newFixedThreadPool(NUM_THREADS);

        for(ICourse c: courses)
            executorService.submit(new AttachSeasonToCourse((Course)c, service));

        waitUntilComplete();
    }

    private static void waitUntilComplete(){

        //stop accepting more tasks
        executorService.shutdown();

        while(!executorService.isTerminated()){
            //wait until all threads have completed their task
        }
    }

}
class AttachSeasonToCourse implements Runnable{

    private CourseService service;
    private Course c;

    public AttachSeasonToCourse(Course c, CourseService service){
        this.c = c;
        this.service = service;
    }

    @Override
    public void run() {
        try {

            System.out.println("Getting season for " + c.getCourseCode());

            List<SemesterSeasons> season = service.getSeasonForCourse(c);
            c.setCourseAvailability(season);
            System.out.println(c.getCourseCode() + " " + season.toString());

        } catch (IOException e) {
            e.printStackTrace();
            System.out.println("Unable to get season for " + c.getCourseCode());
        }
    }
}