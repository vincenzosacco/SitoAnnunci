package org.unical.backend.persistance;

import java.sql.*;

public class DBManager {
    private static DBManager instance = null;

    private DBManager(){}


    public static DBManager getInstance(){
        if (instance == null){
            instance = new DBManager();
        }
        return instance;
    }

    private Connection con = null;

    public Connection getConnection(){
        if (con == null){
            try {
                con = DriverManager.getConnection("jdbc:postgresql://localhost:5432/postgres", "postgres", "WebApp24");
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
        }
        return con;
    }

}
